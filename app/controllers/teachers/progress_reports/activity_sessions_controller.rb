class Teachers::ProgressReports::ActivitySessionsController < Teachers::ProgressReportsController
  def index
    respond_to do |format|
      format.html
      format.json do
        # TODO optimize this. It is insanely slow. 🐌
        query = ::ProgressReports::ActivitySession.new(current_user).results(params)
        page_count = (query.count / ActivitySession::RESULTS_PER_PAGE.to_f).ceil
        activity_sessions = query.paginate(params[:page], ActivitySession::RESULTS_PER_PAGE)
        activity_session_json = activity_sessions.map do |activity_session|
          ::ProgressReports::ActivitySessionSerializer.new(activity_session).as_json(root: false)
        end

        unless(params[:without_filters])
          render json: {
            classrooms: current_user.ids_and_names_of_affiliated_classrooms,
            students: current_user.ids_and_names_of_affiliated_students,
            units: current_user.ids_and_names_of_affiliated_units,
            activity_sessions: activity_session_json,
            page_count: page_count,
          }
        else
          render json: {
            activity_sessions: activity_session_json,
            page_count: page_count,
          }
        end

      end
    end
  end
end
