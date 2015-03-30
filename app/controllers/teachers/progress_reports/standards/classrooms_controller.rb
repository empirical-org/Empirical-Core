class Teachers::ProgressReports::Standards::ClassroomsController < Teachers::ProgressReportsController
  def index
    if request.xhr?
      classrooms = Classroom.for_standards_report(current_user, params)
      render json: {
        classrooms: classrooms,
        teacher: UserWithEmailSerializer.new(current_user).as_json(root: false)
      }
    end
  end
end