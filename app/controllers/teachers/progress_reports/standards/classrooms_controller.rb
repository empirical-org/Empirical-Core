class Teachers::ProgressReports::Standards::ClassroomsController < Teachers::ProgressReportsController
  def index
    if request.xhr?
      render json: {}
    end
  end
end