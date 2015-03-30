class Teachers::ProgressReports::Standards::ClassroomsController < Teachers::ProgressReportsController
  def index
    if request.xhr?
      classrooms = Classroom.for_standards_report(current_user, params)
      render json: {
        classrooms: classrooms
      }
    end
  end
end