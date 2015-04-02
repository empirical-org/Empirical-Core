class Teachers::ProgressReports::Standards::ClassroomTopicsController < Teachers::ProgressReportsController
  def index
    if request.xhr?
      filters = { classroom_id: params[:classroom_id] }
      topics = Topic.for_standards_report(current_user, filters)
      topics_json = topics.map do |topic|
        serializer = ::ProgressReports::Standards::TopicSerializer.new(topic)
        # Doing this because can't figure out how to get custom params into serializers
        serializer.classroom_id = params[:classroom_id]
        serializer.as_json(root: false)
      end
      render json: {
        topics: topics_json
      }
    else
      @classroom = Classroom.find(params[:classroom_id])
    end
  end
end