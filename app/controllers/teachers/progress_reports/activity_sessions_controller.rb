class Teachers::ProgressReports::ActivitySessionsController < Teachers::ProgressReportsController
  def index
    if request.xhr?
      query = ActivitySession.for_standalone_progress_report(current_user, params)
      page_count = (query.count / ActivitySession::RESULTS_PER_PAGE.to_f).ceil
      activity_sessions = query.paginate(params[:page], ActivitySession::RESULTS_PER_PAGE)
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
        page_count: page_count,
        teacher: UserWithEmailSerializer.new(current_user).as_json(root: false),
        units: units
      }
    end
  end
end