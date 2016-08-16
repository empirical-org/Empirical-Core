class Teachers::ProgressReports::DiagnosticReportsController < Teachers::ProgressReportsController

  def show
    @classroom_id = current_user.classrooms_i_teach.last.id || nil
    @report = params[:report] || 'question'
  end

  private

end
