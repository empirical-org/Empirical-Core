# frozen_string_literal: true

class Cms::SchoolAdminsController < Cms::CmsController
  before_action :set_school, only: [:create]

  def create
    user = User.find_by(email: params[:email])
    if user
      create_admin_user_for_existing_user(user)
    else
      create_new_account_for_admin_user
    end
  end

  def set_school
    @school = School.find(params[:school_id])
  end

  private def determine_school_admin_worker(user, school_id, new_user)
    user_id = user.id
    school = School.find_by(id: school_id)
    linked_school = user.school

    return unless school

    if new_user
      InternalTool::AdminAccountCreatedEmailWorker.perform_async(user_id, school_id) && return
    end

    trigger_worker_for_existing_user(user_id, school, linked_school)
  end

  private def trigger_worker_for_existing_user(user_id, school, linked_school)
    if !linked_school || (linked_school && linked_school.name == 'no school selected')
      InternalTool::MadeSchoolAdminLinkSchoolEmailWorker.perform_async(user_id, school_id)
    elsif school == linked_school
      InternalTool::MadeSchoolAdminEmailWorker.perform_async(user_id, school_id)
    elsif school != linked_school
      InternalTool::MadeSchoolAdminChangeSchoolEmailWorker.perform_async(user_id, school_id, linked_school.id)
    end
  end

  private def handle_school_admin_save(user, school_id, new_user)
    determine_school_admin_worker(user, school_id, new_user)
    returned_message = new_user ? t('admin.make_admin') : t('admin_created_account.existing_account.admin.new')

    if params[:is_make_admin_button]
      flash[:success] = t('admin.make_admin')
      redirect_to cms_school_path(school_id)
    else
      render json: { message: returned_message }, status: 200
    end
  end

  private def create_admin_user_for_existing_user(user, new_user: false)
    school_id = params[:school_id]

    if user.admin?
      school_name = SchoolsAdmins.find_by(school_id: school_id).school.name
      return render json: { message: t('admin_created_account.existing_account.admin.linked', school_name: school_name) }
    end

    school_admin = user.schools_admins.build(school_id: school_id)

    if school_admin.save!
      handle_school_admin_save(user, school_id, new_user)
    else
      render json: { error: school_admin.errors.messages }
    end
  end

  private def create_new_account_for_admin_user
    user = @school.users.build(user_params)

    if user.save!
      user.refresh_token!
      ExpirePasswordTokenWorker.perform_in(30.days, user.id)
      create_admin_user_for_existing_user(user, new_user: true)
    else
      render json: { error: user.errors.messages }
    end
  end

  private def user_params
    first_name = params[:first_name]
    last_name = params[:last_name]
    { role: "teacher", email: params[:email], name: "#{first_name} #{last_name}", password: last_name }
  end
end
