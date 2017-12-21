class Teachers::ProgressReports::Standards::ClassroomsController < Teachers::ProgressReportsController

  def index

      format.json do
        render json: {
          data: ::ProgressReports::Standards::AllClassroomsTopic.new(current_user)
          teacher: UserWithEmailSerializer.new(current_user).as_json(root: false)
        }
      end
    end
  end

end
