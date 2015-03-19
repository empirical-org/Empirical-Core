class Teachers::ProgressReports::CsvExportsController < ApplicationController
  before_action :authorize!

  def create
    csv_export = CsvExport.new(export_params)
    csv_export.teacher_id = current_user.id
    if csv_export.save
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

  def authorize!
    return if current_user.try(:teacher?)
    render nothing: true, status: :unauthorized
  end

  def export_params
    params.require(:csv_export).permit(:export_type).tap do |whitelist|
      whitelist[:filters] = params[:csv_export][:filters]
    end
  end
end