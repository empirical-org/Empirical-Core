class Teachers::ProgressReports::ActivitySessionsController < ApplicationController
  before_action :authorize!
  layout 'scorebook'

  def index
    if request.xhr?
      activity_sessions = ActivitySession.completed.by_teacher(current_user)
        .includes(:user, :activity => :topic, :classroom_activity => :classroom)
      activity_session_json = activity_sessions.map do |activity_session|
        ::ProgressReports::ActivitySessionSerializer.new(activity_session).as_json(root: false)
      end
      classrooms = Classroom.for_progress_report(current_user, {})
      students = User.for_progress_report(current_user, {})
      units = Unit.for_progress_report(current_user, {})
      render json: {
        activity_sessions: activity_session_json,
        classrooms: classrooms,
        students: students,
        units: units
      }
    end
  end

  private

  def authorize!
    return if current_user.try(:teacher?)
    render nothing: true, status: :unauthorized
  end
end