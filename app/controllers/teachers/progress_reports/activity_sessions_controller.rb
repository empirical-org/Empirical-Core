class Teachers::ProgressReports::ActivitySessionsController < ApplicationController
  before_action :authorize!
  layout 'scorebook'

  def index
    if request.xhr?
      activity_sessions = ActivitySession.completed.by_teacher(current_user)
        .includes(:activity, :user, :classroom_activity => :classroom)
        
      render json: activity_sessions, each_serializer: ::ProgressReports::ActivitySessionSerializer
    end
  end

  private

  def authorize!
    return if current_user.try(:teacher?)
    render nothing: true, status: :unauthorized
  end
end