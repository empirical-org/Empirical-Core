class Api::Internal::ProgressReports::ActivitySessionsController < ApiController
  def index
    activity_sessions = ActivitySession.all
    render json: activity_sessions, each_serializer: ::ProgressReports::ActivitySessionSerializer
  end
end