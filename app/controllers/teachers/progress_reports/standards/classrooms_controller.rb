class Teachers::ProgressReports::Standards::ClassroomsController < Teachers::ProgressReportsController
  def index
    Checkbox.find_or_create_checkbox('View Standard Reports', current_user)
    respond_to do |format|
      format.html do
        AccessProgressReportWorker.perform_async(current_user.id)
      end

      format.json do
        classrooms = ::ProgressReports::Standards::Classroom.new(current_user).results(params)
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
end
