class Teachers::ProgressReports::Standards::ClassroomTopicsController < Teachers::ProgressReportsController
  include UnitsWithCompletedActivities

  def index
    respond_to do |format|
      format.html
      format.json do
        return render json: {}, status: 401 unless current_user.classrooms_i_teach.map(&:id).include?(params[:classroom_id].to_i)

        topics = ::ProgressReports::Standards::Topic.new(current_user).results(params)
        topics_json = topics.map do |topic|
          serializer = ::ProgressReports::Standards::TopicSerializer.new(topic)
          # Doing this because can't figure out how to get custom params into serializers
          serializer.classroom_id = params[:classroom_id]
          serializer.as_json(root: false)
        end

        cus = Classroom.where(id: params[:classroom_id]).includes(:classroom_units).map(&:classroom_units).flatten

        render json: {
          topics: topics_json,
          units: units_with_completed_activities(cus),
          classroom: current_user.classrooms_i_teach.find{|classroom| classroom.id == params[:classroom_id].to_i},
          teacher: UserWithEmailSerializer.new(current_user).as_json(root: false)
        }
      end
    end
  end
end
