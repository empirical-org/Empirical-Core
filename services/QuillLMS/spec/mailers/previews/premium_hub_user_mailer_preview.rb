# frozen_string_literal: true

class UserMailerPreview < ActionMailer::Preview
  def admin_usage_snapshot_report_pdf_email
    PremiumHubUserMailer.admin_usage_snapshot_report_pdf_email(download_url: 'localhost:3000/blah', pdf_subscription: PdfSubscription.last)
  end
end
