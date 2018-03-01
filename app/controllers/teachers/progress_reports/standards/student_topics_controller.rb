class Teachers::ProgressReports::Standards::StudentTopicsController < Teachers::ProgressReportsController
  def index
    respond_to do |format|
      format.html
      format.json do
        topics = ::ProgressReports::Standards::NewTopic.new(current_user).results(params)
        topics_json = topics.map do |topic|
          serializer = ::ProgressReports::Standards::TopicSerializer.new(topic)
          # Doing this because can't figure out how to get custom params into serializers
          serializer.classroom_id = params[:classroom_id]
          serializer.as_json(root: false)
        end
        student = User.find(params[:student_id])
        student = nil unless current_user.teaches_student?(student.id)
        render json: {
          topics: topics_json,
          student: student,
          units: ProgressReports::Standards::Unit.new(current_user).results({}),
          teacher: UserWithEmailSerializer.new(current_user).as_json(root: false)
        }
      end
    end
  end
end
