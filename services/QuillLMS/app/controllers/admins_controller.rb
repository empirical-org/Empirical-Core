# frozen_string_literal: true

class AdminsController < ApplicationController
  around_action :force_writer_db_role,
    only: [
      :sign_in_classroom_manager,
      :sign_in_progress_reports,
      :sign_in_account_settings
    ]

  before_action :admin!

  before_action :set_teacher, :admin_of_this_teacher!,
    only: %w{
      resend_login_details
      remove_as_admin
      make_admin
      unlink_from_school
      sign_in_classroom_manager
      sign_in_progress_reports
      sign_in_account_settings
    }

  before_action :sign_in,
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

  def resend_login_details
    @teacher.refresh_token!
    ExpirePasswordTokenWorker.perform_in(30.days, @teacher.id)

    if params[:role] == 'admin'
      AdminDashboard::AdminAccountCreatedEmailWorker.perform_async(@teacher.id, current_user.id, params[:school_id], true)
    else
      AdminDashboard::TeacherAccountCreatedEmailWorker.perform_async(@teacher.id, current_user.id, params[:school_id], true)
    end

    render json: {message: t('admin.resend_login_details')}, status: 200
  end

  def remove_as_admin
    SchoolsAdmins&.find_by(user_id: params[:id], school_id: params[:school_id])&.destroy!
    reset_admin_users_cache
    render json: {message: t('admin.remove_admin')}, status: 200
  end

  def make_admin
    SchoolsAdmins.create!(user_id: params[:id], school_id: params[:school_id])
    AdminDashboard::MadeSchoolAdminEmailWorker.perform_async(params[:id], current_user.id, params[:school_id])
    reset_admin_users_cache
    render json: {message: t('admin.make_admin')}, status: 200
  end

  def unlink_from_school
    @teacher&.unlink
    reset_admin_users_cache
    render json: {message: t('admin.unlink_teacher_from_school')}, status: 200
  end

  def create_and_link_accounts
    @school = School.find_by(id: params[:school_id])

    unless SchoolsAdmins.exists?(school: @school, user: current_user)
      render json: {errors: t('admin.current_user_is_not_an_admin')}, status: 422
      return
    end

    @teacher = User.find_by(email: teacher_params[:email])

    @is_admin = teacher_params[:role] == 'admin'
    teacher_params.delete(:role)

    if @teacher
      if @is_admin
        handle_existing_user_submitted_as_admin
      else
        handle_existing_user_submitted_as_teacher
      end
    else
      handle_new_user
    end

    if @teacher.errors.empty?
      # Return the message to the admin and reset the cache so the next request can load fresh data
      reset_admin_users_cache
      render json: {message: @message}, status: 200
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
    if @teacher.school.nil? || @teacher.school.name == School::NOT_LISTED_SCHOOL_NAME
      AdminDashboard::MadeSchoolAdminLinkSchoolEmailWorker.perform_async(@teacher.id, current_user.id, @school.id)
    elsif @teacher.school == @school
      AdminDashboard::MadeSchoolAdminEmailWorker.perform_async(@teacher.id, current_user.id, @school.id)
    else
      AdminDashboard::MadeSchoolAdminChangeSchoolEmailWorker.perform_async(@teacher.id, current_user.id, @school.id, @teacher.school.id)
    end
  end

  private def handle_existing_user_submitted_as_admin
    if SchoolsAdmins.exists?(user: @teacher, school: @school)
      @message = t('admin_created_account.existing_account.admin.linked', school_name: @school.name)
    else
      existing_admin = SchoolsAdmins.find_by(user_id: @teacher.id)
      SchoolsAdmins.create(user: @teacher, school: @school)
      @message = existing_admin ? t('admin_created_account.existing_account.admin.admin_for_other_school') : t('admin_created_account.existing_account.admin.new')
      handle_new_school_admin_email
    end
  end

  private def handle_existing_user_submitted_as_teacher
    if SchoolsUsers.exists?(user: @teacher, school: @school)
      # Teacher is already in the school, let the admin know.
      @message = t('admin_created_account.existing_account.teacher.linked', school_name: @school.name)
    else
      # Send invite to the school to the teacher via email.
      @message = t('admin_created_account.existing_account.teacher.new', school_name: @school.name)
      AdminDashboard::TeacherLinkSchoolEmailWorker.perform_async(@teacher.id, current_user.id, @school.id)
    end
  end

  private def handle_new_user
    # Create a new teacher, and automatically join them to the school.
    @teacher = @school.users.create(teacher_params.merge({ role: User::TEACHER, password: teacher_params[:last_name] }))
    @teacher.refresh_token!
    ExpirePasswordTokenWorker.perform_in(30.days, @teacher.id)
    if @is_admin
      SchoolsAdmins.create(user: @teacher, school: @school)
      @message = t('admin_created_account.new_account.admin')
      AdminDashboard::AdminAccountCreatedEmailWorker.perform_async(@teacher.id, current_user.id, @school.id, false)
    else
      @message = t('admin_created_account.new_account.teacher')
      AdminDashboard::TeacherAccountCreatedEmailWorker.perform_async(@teacher.id, current_user.id, @school.id, false)
    end
  end

  private def reset_admin_users_cache
    $redis.del("SERIALIZED_ADMIN_USERS_FOR_#{current_user.id}")
    FindAdminUsersWorker.perform_async(current_user.id)
  end

  private def teacher_params
    params.require(:teacher).permit(:admin_id, :first_name, :last_name, :email, :role)
  end

end
