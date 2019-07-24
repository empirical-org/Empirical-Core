class Teachers::ProgressReports::Standards::ClassroomStudentsController < Teachers::ProgressReportsController
  include UnitsWithCompletedActivities

  def index
    respond_to do |format|
      format.html
      format.json do
        return render json: {}, status: 401 unless current_user.classrooms_i_teach.map(&:id).include?(params[:classroom_id].to_i)

        students = ::ProgressReports::Standards::Student.new(current_user).results(params)
        students_json = students.map do |student|
          serializer = ::ProgressReports::Standards::StudentSerializer.new(student)
          # Doing this because can't figure out how to get custom params into serializers
          serializer.classroom_id = params[:classroom_id]
          serializer.as_json(root: false)
        end

        cus = Classroom.where(id: params[:classroom_id]).includes(:classroom_units).map(&:classroom_units).flatten

        render json: {
          students: students_json,
          classroom: current_user.classrooms_i_teach.find{|classroom| classroom.id == params[:classroom_id].to_i},
          units: units_with_completed_activities(cus),
          teacher: UserWithEmailSerializer.new(current_user).as_json(root: false)
        }
      end
    end
  end
end
