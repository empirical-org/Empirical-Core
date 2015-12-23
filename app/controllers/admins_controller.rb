class AdminsController < ApplicationController
  before_action :admin!
  before_action :sign_in, only: [:sign_in_classroom_manager, :sign_in_progress_reports]

  def show
    render json: Admin::AdminSerializer.new(current_user, root: false)
  end

  def sign_in_classroom_manager
    redirect_to teachers_classrooms_path
  end

  def sign_in_progress_reports
    redirect_to teachers_progress_reports_standards_classrooms_path
  end

  private

  def sign_in
    session[:admin_id] = current_user.id
    super(User.find(params[:id]))
  end

end