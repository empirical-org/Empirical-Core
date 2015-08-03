class Teachers::ProgressReportsController < ApplicationController
  before_action :authorize!, except: :demo
  before_action :handle_expired_trial, except: :demo
  before_action :set_vary_header, if: -> { request.xhr? }

  def demo
    @user = User.find_by_username 'demo'
    sign_in @user
    redirect_to teachers_progress_reports_standards_classrooms_path
  end

  private

  def handle_expired_trial
    return if current_user.is_premium? or !current_user.is_trial_expired?
    render :trial_expired
  end

  def authorize!
    return if current_user.try(:teacher?)
    render nothing: true, status: :unauthorized
  end
end