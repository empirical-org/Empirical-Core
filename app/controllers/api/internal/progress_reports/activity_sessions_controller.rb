class Api::Internal::ProgressReports::ActivitySessionsController < ApplicationController
  before_action :authorize!

  def index
    activity_sessions = ActivitySession.completed.by_teacher(current_user).includes(:activity, :classroom_activity => :classroom)
    render json: activity_sessions, each_serializer: ::ProgressReports::ActivitySessionSerializer
  end

  private

  def authorize!
    return if current_user.try(:teacher?)
    render nothing: true, status: :unauthorized
  end
end