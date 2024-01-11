# frozen_string_literal: true

module Pdfs
  class AdminUsageSnapshotEmailJob
    include Sidekiq::Worker
    sidekiq_options queue: SidekiqQueue::LOW

    class CloudUploadError < StandardError; end

    PDF_TEMPLATE = 'pdfs/admin_usage_snapshot_report'

    attr_reader :pdf_subscription

    delegate :admin_report_filter_selection, to: :pdf_subscription
    delegate :user, to: :admin_report_filter_selection

    def perform(pdf_subscription_id)
      return unless user.school_or_district_premium?

      @pdf_subscription = ::PdfSubscription.find(pdf_subscription_id)

      raise CloudUploadError, "Unable to upload PDF for user #{user_id}" unless uploader.store!(pdf_file)

      ::PremiumHubUserMailer.admin_usage_snapshot_report_pdf_email.deliver_now!

      # The response-content-disposition param triggers browser file download instead of screen rendering
      uploader.url(query: {"response-content-disposition" => "attachment;"})
    end

    private def data = ::Pdfs::AdminUsageSnapshotReports::DataAggregator.run(admin_report_filter_selection)
    private def pdf_file = ::Pdfs::FileBuilder.run(data:, template: PDF_TEMPLATE)
    private def uploader = @uploader ||= ::Pdfs::AdminUsageSnapshotReportUploader.new(user_id:)
    private def user_id = user.id
  end
end
