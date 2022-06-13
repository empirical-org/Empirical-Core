# frozen_string_literal: true

class AdminsController < ApplicationController
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

  private def set_teacher
    @teacher = User.find(params[:id])
  end

  private def admin_of_this_teacher!
    return if SchoolsAdmins.where(user_id: current_user.id, school_id: @teacher.school.id).limit(1).exists?

    auth_failed
  end

  private def sign_in
    session[:admin_id] = current_user.id
    super(@teacher)
  end

end
