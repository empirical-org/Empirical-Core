class AdminsController < ApplicationController
  before_action :admin!
  before_action :set_teacher, :admin_of_this_teacher!, :sign_in,
                only: [:sign_in_classroom_manager,
                                     :sign_in_progress_reports,
                                     :sign_in_account_settings]



  def show
    render json: UserAdminSerializer.new(current_user, root: false)
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

  private

  def set_teacher
    @teacher = User.find(params[:id])
  end

  def admin_of_this_teacher!
    return if SchoolsAdmins.where(user_id: current_user.id, school_id: @teacher.school.id).limit(1).exists?
    auth_failed
  end

  def sign_in
    session[:admin_id] = current_user.id
    super(@teacher)
  end

end
