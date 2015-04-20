class Teachers::ProgressReports::Standards::ClassroomsController < Teachers::ProgressReportsController
  def index
    if request.xhr?
      classrooms = Classroom.for_standards_report(current_user, params)
      classroom_json = classrooms.map do |classroom|
        ::ProgressReports::Standards::ClassroomSerializer.new(classroom).as_json(root: false)
      end
      render json: {
        classrooms: classroom_json,
        teacher: UserWithEmailSerializer.new(current_user).as_json(root: false)
      }
    end
  end
end