class Teachers::ProgressReports::ActivitySessionsController < Teachers::ProgressReportsController
  def index
    if request.xhr?
      activity_sessions = ActivitySession.for_standalone_progress_report(current_user, params)
      activity_session_json = activity_sessions.map do |activity_session|
        ::ProgressReports::ActivitySessionSerializer.new(activity_session).as_json(root: false)
      end
      classrooms = Classroom.for_standards_report(current_user, {})
      students = User.for_standards_report(current_user, {})
      units = Unit.for_standards_progress_report(current_user, {})
      render json: {
        activity_sessions: activity_session_json,
        classrooms: classrooms,
        students: students,
        teacher: UserWithEmailSerializer.new(current_user).as_json(root: false),
        units: units
      }
    end
  end
end