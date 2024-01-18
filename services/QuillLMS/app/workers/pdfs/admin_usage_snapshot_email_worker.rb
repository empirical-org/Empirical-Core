# frozen_string_literal: true

module Pdfs
  class AdminUsageSnapshotEmailWorker
    include Sidekiq::Worker
    sidekiq_options queue: SidekiqQueue::LOW

    class CloudUploadError < StandardError; end

    PDF_TEMPLATE = 'pdfs/admin_usage_snapshot_report'

    # The response-content-disposition triggers browser file download instead of screen rendering
    RESPONSE_CONTENT_DISPOSITION= { "response-content-disposition" => "attachment;" }

    attr_reader :pdf_subscription

    delegate :admin_report_filter_selection, :user, to: :pdf_subscription

    def perform(pdf_subscription_id)
      @pdf_subscription = ::PdfSubscription.find(pdf_subscription_id)

      return unless user.school_or_district_premium?

      raise CloudUploadError, "Unable to upload PDF for user #{user_id}" unless uploader.store!(pdf_file)

      ::PremiumHubUserMailer
        .admin_usage_snapshot_report_pdf_email(pdf_subscription:, download_url:)
        .deliver_now!
    end

    private def data = ::Pdfs::AdminUsageSnapshotReports::DataAggregator.run(admin_report_filter_selection)
    private def pdf_file = ::Pdfs::FileBuilder.run(data:, template: PDF_TEMPLATE)
    private def uploader = @uploader ||= ::Pdfs::AdminUsageSnapshotReportUploader.new(user_id:)
    private def download_url = uploader.url(query: RESPONSE_CONTENT_DISPOSITION)
    private def user_id = user.id
  end
end
