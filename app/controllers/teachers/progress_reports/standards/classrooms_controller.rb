class Teachers::ProgressReports::Standards::ClassroomsController < Teachers::ProgressReportsController
  def index
    respond_to do |format|
      format.html do
        AccessProgressReportWorker.perform_async(current_user.id)
      end

      format.json do
        render json: {
          ::ProgressReports::Standards::AllClassroomsTopic.new(current_user)
          classrooms: classroom_json,
          teacher: UserWithEmailSerializer.new(current_user).as_json(root: false)
        }
      end
    end
  end
end
