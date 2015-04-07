class Teachers::ProgressReports::Standards::StudentTopicsController < Teachers::ProgressReportsController
  def index
    if request.xhr?
      topics = Topic.for_standards_report(current_user, params)
      render json: {
        topics: topics,
        student: current_user.students.find(params[:student_id]),
        units: Unit.for_standards_progress_report(current_user, {}),
        teacher: UserWithEmailSerializer.new(current_user).as_json(root: false)
      }
    end
  end
end