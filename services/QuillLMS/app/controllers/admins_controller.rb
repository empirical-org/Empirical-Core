# frozen_string_literal: true

class AdminsController < ApplicationController
  around_action :force_writer_db_role,
    only: [
      :sign_in_classroom_manager,
      :sign_in_progress_reports,
      :sign_in_account_settings
    ]

  before_action :admin!
  before_action :set_teacher,
    :admin_of_this_teacher!,
    :sign_in,
    only: %w{
      sign_in_classroom_manager
      sign_in_progress_reports
      sign_in_account_settings
    }

  def show
    serialized_admin_users_json = $redis.get("SERIALIZED_ADMIN_USERS_FOR_#{current_user.id}")
    if serialized_admin_users_json
      serialized_admin_users = JSON.parse(serialized_admin_users_json)
    end
    if serialized_admin_users.nil?
      FindAdminUsersWorker.perform_async(current_user.id)
      render json: { id: current_user.id }
    else
      render json: serialized_admin_users
    end
  end

  def sign_in_classroom_manager
    redirect_to teachers_classrooms_path
  end

  def sign_in_progress_reports
    redirect_to teachers_progress_reports_standards_classrooms_path
  end

  def sign_in_account_settings
    redirect_to teachers_my_account_path
  end

  def create_and_link_accounts
    @school = School.find_by(id: params[:school_id])

    if SchoolsAdmins.find_by(school: @school, user: current_user).nil?
      render json: {errors: 'Something went wrong. If this problem persists, please contact us at hello@quill.org'}, status: 422
      return
    end

    @teacher = User.find_by(email: teacher_params[:email])

    is_admin = teacher_params[:role] === 'admin'
    teacher_params.delete(:role)

    if @teacher
      if is_admin
        if SchoolsAdmins.find_by(user: @teacher, school: @school)
          message = t('admin_created_account.existing_account.admin.linked', school_name: @school.name)
        else
          message = t('admin_created_account.existing_account.admin.new')
          handle_new_school_admin_email
        end
      else
        if SchoolsUsers.find_by(user: @teacher, school: @school)
          # Teacher is already in the school, let the admin know.
          message = t('admin_created_account.existing_account.teacher.linked', school_name: @school.name)
        else
          # Send invite to the school to the teacher via email.
          message = t('admin_created_account.existing_account.teacher.new', school_name: @school.name)
          AdminDashboard::TeacherLinkSchoolEmailWorker.perform_async(@teacher.id, current_user.id, @school.id)
        end
      end
    else
      # Create a new teacher, and automatically join them to the school.
      @teacher = @school.users.create(teacher_params.merge({ role: 'teacher', password: teacher_params[:last_name] }))
      @teacher.refresh_token!
      ExpirePasswordTokenWorker.perform_in(30.days, @teacher.id)
      if is_admin
        SchoolsAdmins.create(user: @teacher, school: @school)
        message = t('admin_created_account.new_account.admin')
        AdminDashboard::AdminAccountCreatedEmailWorker.perform_async(@teacher.id, current_user.id, @school.id, false)
      else
        message = t('admin_created_account.new_account.teacher')
        AdminDashboard::TeacherAccountCreatedEmailWorker.perform_async(@teacher.id, current_user.id, @school.id, false)
      end
    end

    if @teacher.errors.empty?
      # Return the message to the admin
      render json: {message: message}, status: 200
    else
       # Return errors if there are any.
      render json: @teacher.errors, status: 422
    end
  end

  private def set_teacher
    @teacher = User.find(params[:id])
  end

  private def admin_of_this_teacher!
    return if SchoolsAdmins.exists?(school: @teacher.school, user: current_user)

    auth_failed
  end

  private def sign_in
    session[:admin_id] = current_user.id
    super(@teacher)
  end

  private def handle_new_school_admin_email
    if @teacher.school.nil?
      AdminDashboard::MadeSchoolAdminLinkSchoolEmailWorker.perform_async(@teacher.id, current_user.id, @school.id)
    elsif @teacher.school === @school
      AdminDashboard::MadeSchoolAdminEmailWorker.perform_async(@teacher.id, current_user.id, @school.id)
    else
      AdminDashboard::MadeSchoolAdminChangeSchoolEmailWorker.perform_async(@teacher.id, current_user.id, @school.id, @teacher.school.id)
    end
  end

  private def teacher_params
    params.require(:teacher).permit(:admin_id, :first_name, :last_name, :email, :role)
  end

end
