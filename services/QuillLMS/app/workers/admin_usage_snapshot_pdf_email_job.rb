# frozen_string_literal: true

class AdminUsageSnapshotPdfEmailJob
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  PDF_TEMPLATE = 'pdfs/admin_usage_snapshot_report_pdf'

  attr_reader :pdf_subscription

  def perform(pdf_subscription_id)
    @pdf_subscription = PdfSubscription.find(pdf_subscription_id)

    raise CloudUploadError, "Unable to upload PDF for Admin #{admin_id}" unless uploader.store!(pdf_file)

    PremiumHubUserMailer.admin_usage_snapshot_report_pdf_email.deliver_now!

    # The response-content-disposition param triggers browser file download instead of screen rendering
    uploader.url(query: {"response-content-disposition" => "attachment;"})
  end

  private def admin_report_filter_selection = pdf_subscription.admin_report_filter_selection
  private def data = AdminUsageSnapshotPdfInputDataBuilder.run(admin_report_filter_selection)
  private def pdf_file = PdfFileBuilder.run(data, PDF_TEMPLATE)
  private def uploader = @uploader ||= AdminUsageSnapshotReportPdfUploader.new(user_id:)
  private def user = admin_report_filter_selection.user
  private def user_id = user.id
end
