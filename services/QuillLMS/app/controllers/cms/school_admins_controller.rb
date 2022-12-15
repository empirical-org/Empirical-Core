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

  private def create_admin_user_for_existing_user(user, new_user: false)
    school_id = params[:school_id]
    should_render_school_view = params[:is_make_admin_button]

    if user.admin?
      school_name = SchoolsAdmins.find_by(school_id: school_id).school.name
      render json: { message: t('admin_created_account.existing_account.admin.linked', school_name: school_name) }
    else
      admin = SchoolsAdmins.new
      admin.school_id = school_id
      admin.user_id = user.id

      begin
        admin.save!
      rescue => e
        return render json: { error: e.message }
      end

      user.mailer_user.determine_email_and_send(school_id: school_id, new_user: new_user)
      returned_message = new_user ? t('admin.make_admin') : t('admin_created_account.existing_account.admin.new')

      if should_render_school_view
        flash[:success] = t('admin.make_admin')
        redirect_to cms_school_path(school_id)
      else
        render json: { message: returned_message }, status: 200
      end
    end
  end

  private def create_new_account_for_admin_user
    email = params[:email]
    first_name = params[:first_name]
    last_name = params[:last_name]
    user_params = { role: "teacher", email: email, name: "#{first_name} #{last_name}", password: last_name }
    user = @school.users.create(user_params)

    begin
      user.save!
    rescue => e
      return render json: { error: e.message }
    end

    user.refresh_token!
    ExpirePasswordTokenWorker.perform_in(30.days, user.id)
    create_admin_user_for_existing_user(user, new_user: true)
  end
end
