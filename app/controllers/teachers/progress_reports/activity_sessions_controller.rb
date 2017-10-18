class Teachers::ProgressReports::ActivitySessionsController < Teachers::ProgressReportsController
  def index
    respond_to do |format|
      format.html
      format.json do
        query = ::ProgressReports::ActivitySession.new(current_user).results(params)
        page_count = (query.count / ActivitySession::RESULTS_PER_PAGE.to_f).ceil
        activity_sessions = query.paginate(params[:page], ActivitySession::RESULTS_PER_PAGE)
        activity_session_json = activity_sessions.map do |activity_session|
          ::ProgressReports::ActivitySessionSerializer.new(activity_session).as_json(root: false)
        end
        classrooms = ProgressReports::Standards::Classroom.new(current_user).results({})
        students = ProgressReports::Standards::Student.new(current_user).results({})
        units = ProgressReports::Standards::Unit.new(current_user).results({})
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
end
