class Teachers::ProgressReports::Standards::ClassroomTopicsController < Teachers::ProgressReportsController
  def index
    if request.xhr?
      topics = Topic.for_standards_report(current_user, params)
      topics_json = topics.map do |topic|
        serializer = ::ProgressReports::Standards::TopicSerializer.new(topic)
        # Doing this because can't figure out how to get custom params into serializers
        serializer.classroom_id = params[:classroom_id]
        serializer.as_json(root: false)
      end
      render json: {
        topics: topics_json,
        units: Unit.for_standards_progress_report(current_user, {}),
        classroom: current_user.classrooms.find(params[:classroom_id]),
        teacher: UserWithEmailSerializer.new(current_user).as_json(root: false)
      }
    end
  end
end