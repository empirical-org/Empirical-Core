class Teachers::ProgressReportsController < ApplicationController
  before_action :authorize!, except: :demo
  layout 'scorebook'
  before_action :set_vary_header, if: -> { request.xhr? }

  def demo
    @user = User.find_by_username 'demo'
    sign_in @user
    redirect_to teachers_progress_reports_standards_classrooms_path
  end

  private

  def authorize!
    return if current_user.try(:teacher?)
    render nothing: true, status: :unauthorized
  end
end