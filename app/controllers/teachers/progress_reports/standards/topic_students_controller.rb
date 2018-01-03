class Teachers::ProgressReports::Standards::TopicStudentsController < Teachers::ProgressReportsController
  def index
    respond_to do |format|
      format.html
      format.json do
        students = ::ProgressReports::Standards::NewStudent.new(current_user).results(params)
        students_json = students.map do |student|
          serializer = ::ProgressReports::Standards::StudentSerializer.new(student)
          # Doing this because can't figure out how to get custom params into serializers
          serializer.classroom_id = params[:classroom_id]
          serializer.as_json(root: false)
        end
        topics = ::ProgressReports::Standards::NewTopic.new(current_user).results(params)
        topics_json = topics.map do |topic|
          serializer = ::ProgressReports::Standards::TopicSerializer.new(topic)
          # Doing this because can't figure out how to get custom params into serializers
          serializer.classroom_id = params[:classroom_id]
          serializer.as_json(root: false)
        end
        selected_classroom = params[:classroom_id] == 0 ? 'All Classrooms' : Classroom.find_by(id: params[:classroom_id])
        render json: {
          selected_classroom: selected_classroom,
          classrooms: current_user.classrooms_i_teach,
          students: students_json,
          topics: topics_json,
          units: ProgressReports::Standards::Unit.new(current_user).results({}),
          teacher: UserWithEmailSerializer.new(current_user).as_json(root: false)
        }
      end
    end
  end
end
