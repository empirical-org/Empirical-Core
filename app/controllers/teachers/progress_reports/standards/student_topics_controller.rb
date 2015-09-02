class Teachers::ProgressReports::Standards::StudentTopicsController < Teachers::ProgressReportsController
  def index
    respond_to do |format|
      format.html
      format.json do
        topics = ::ProgressReports::Standards::Topic.new(current_user).results(params)
        render json: {
          topics: topics,
          student: current_user.students.find(params[:student_id]),
          units: ProgressReports::Standards::Unit.new(current_user).results({}),
          teacher: UserWithEmailSerializer.new(current_user).as_json(root: false)
        }
      end
    end
  end
end