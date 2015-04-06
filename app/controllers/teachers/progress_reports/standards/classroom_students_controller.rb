class Teachers::ProgressReports::Standards::ClassroomStudentsController < Teachers::ProgressReportsController
  def index
    if request.xhr?
      filters = { classroom_id: params[:classroom_id] }
      students = User.for_standards_report(current_user, filters)
      students_json = students.map do |student|
        serializer = ::ProgressReports::Standards::StudentSerializer.new(student)
        # Doing this because can't figure out how to get custom params into serializers
        serializer.classroom_id = params[:classroom_id]
        serializer.as_json(root: false)
      end
      render json: {
        students: students_json,
        classroom: current_user.classrooms.find(params[:classroom_id])
      }
    end
  end
end