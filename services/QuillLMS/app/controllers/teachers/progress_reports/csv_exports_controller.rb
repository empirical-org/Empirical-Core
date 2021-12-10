# frozen_string_literal: true

class Teachers::ProgressReports::CsvExportsController < Teachers::ProgressReportsController
  require 'pusher'

  def create
    csv_export = CsvExport.new(export_params)
    csv_export.teacher_id = current_user.id
    csv_export.filters ||= {}
    csv_export.filters.merge!(extra_url_params)
    if csv_export.save
      CsvExportWorker.perform_async(csv_export.id, current_user.id)
      render json: {
        csv_export: csv_export
      }
    else
      render json: {
        errors: csv_export.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private def export_params
    params.require(:csv_export).permit(:export_type, filters: [
      :page,
      :classroom_id,
      :student_id,
      :unit_id,
      :standard_id,
      sort: [:field, :direction]
])
  end

  private def extra_url_params
    extra = Rails.application.routes.recognize_path(params[:report_url])
    extra.delete(:controller)
    extra.delete(:action)
    extra
  end
end
