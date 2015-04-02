class Teachers::ProgressReports::Standards::TopicsController < Teachers::ProgressReportsController
  def index
    if request.xhr?
      topics = Topic.for_standards_report(current_user, params)
      render json: {
        topics: topics
      }
    else
      @student = current_user.students.find(params[:student_id])
    end
  end
end