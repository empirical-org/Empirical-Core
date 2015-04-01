class Teachers::ProgressReports::Standards::ClassroomStudentsController < Teachers::ProgressReportsController
  def index
    if request.xhr?
      filters = { classroom_id: params[:classroom_id] }
      students = User.for_standards_report(current_user, filters)
      render json: {
        students: students
      }
    else
      @classroom = Classroom.find(params[:classroom_id])
    end
  end
end