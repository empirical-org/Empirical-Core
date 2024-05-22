# frozen_string_literal: true

class PremiumHubUserMailerPreview < ActionMailer::Preview
  class NoPdfSubscriptionsError < StandardError; end

  def admin_usage_snapshot_report_pdf_email
    raise NoPdfSubscriptionsError if PdfSubscription.count.zero?

    PremiumHubUserMailer.admin_usage_snapshot_report_pdf_email(download_url: 'localhost:3000/blah', pdf_subscription: PdfSubscription.last)
  end
end
