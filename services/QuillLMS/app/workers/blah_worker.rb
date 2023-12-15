# frozen_string_literal: true

class BlahWorker
  include Sidekiq::Worker

  class CloudUploadError < StandardError; end

  PDF_TEMPLATE = 'pdfs/admin_usage_snapshot_report_pdf'

  def perform(admin_filter_selection_id)
    raise CloudUploadError, "Unable to upload PDF for user #{user_id}" unless uploader.store!(pdf_file)

    # The response-content-disposition param triggers browser file download instead of screen rendering
    uploader.url(query: {"response-content-disposition" => "attachment;"})
  end

  private def data = {}
  private def pdf_file = PdfFileBuilder.run(data, PDF_TEMPLATE)
  private def uploader = @uploader ||= AdminUsageSnapshotReportPdfUploader.new(admin_id: user_id)
  private def user_id = 1
end
