class Teachers::ProgressReports::Standards::ClassroomsController < Teachers::ProgressReportsController
  def index
    if request.xhr?
      classrooms = Classroom.all
      render json: {
        classrooms: classrooms
      }
    end
  end
end