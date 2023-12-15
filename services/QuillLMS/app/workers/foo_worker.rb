# frozen_string_literal: true

class FooWorker
  include Sidekiq::Worker

  PDF_TEMPLATE = 'pdfs/admin_usage_snapshot_report_pdf'

  def perform(admin_filter_selection_id); end

  private def data = {}
  private def pdf_file = PdfFileBuilder.run(data, PDF_TEMPLATE)
  private def uploader = AdminUsageSnapshotReportPdfUploader.new(admin_id: user_id)
  private def user_id = 1
end
