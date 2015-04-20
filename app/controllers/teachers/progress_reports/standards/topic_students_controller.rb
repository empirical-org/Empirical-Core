class Teachers::ProgressReports::Standards::TopicStudentsController < Teachers::ProgressReportsController
  def index
    if request.xhr?
      students = User.for_standards_report(current_user, params)
      students_json = students.map do |student|
        serializer = ::ProgressReports::Standards::StudentSerializer.new(student)
        # Doing this because can't figure out how to get custom params into serializers
        serializer.classroom_id = params[:classroom_id]
        serializer.as_json(root: false)
      end
      render json: {
        students: students_json,
        topic: Topic.find(params[:topic_id]),
        units: Unit.for_standards_progress_report(current_user, {}),
        teacher: UserWithEmailSerializer.new(current_user).as_json(root: false)
      }
    end
  end
end