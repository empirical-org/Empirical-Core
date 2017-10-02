class Teachers::ProgressReports::Standards::TopicStudentsController < Teachers::ProgressReportsController
  def index
    respond_to do |format|
      format.html
      format.json do
        students = ::ProgressReports::Standards::Student.new(current_user).results(params)
        students_json = students.map do |student|
          serializer = ::ProgressReports::Standards::StudentSerializer.new(student)
          # Doing this because can't figure out how to get custom params into serializers
          serializer.classroom_id = params[:classroom_id]
          serializer.as_json(root: false)
        end
        topics = ::ProgressReports::Standards::Topic.new(current_user).results(params)
        topics_json = topics.map do |topic|
          serializer = ::ProgressReports::Standards::TopicSerializer.new(topic)
          # Doing this because can't figure out how to get custom params into serializers
          serializer.classroom_id = params[:classroom_id]
          serializer.as_json(root: false)
        end
        render json: {
          students: students_json,
          topics: topics_json,
          units: ProgressReports::Standards::Unit.new(current_user).results({}),
          teacher: UserWithEmailSerializer.new(current_user).as_json(root: false)
        }
      end
    end
  end
end
