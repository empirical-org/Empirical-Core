class Teachers::ProgressReports::CsvExportsController < Teachers::ProgressReportsController
  def create
    csv_export = CsvExport.new(export_params)
    csv_export.teacher_id = current_user.id
    if csv_export.save
      CsvExportWorker.perform_async(csv_export.id)
      render json: {
        csv_export: csv_export
      }
    else
      render json: {
        errors: csv_export.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def export_params
    params.require(:csv_export).permit(:export_type, :filters => [:student_id, :classroom_id, :unit_id])
  end
end