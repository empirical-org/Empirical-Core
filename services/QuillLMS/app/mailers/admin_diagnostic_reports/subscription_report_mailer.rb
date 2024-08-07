# frozen_string_literal: true

module AdminDiagnosticReports
  class SubscriptionReportMailer < ReportMailer
    def csv_download_email(user_id, overview_url, skills_url, students_url, subscription)
      @subscription = subscription
      @frequency = @subscription.frequency
      @premium_hub_url = "#{ENV['DEFAULT_URL']}/teachers/premium_hub"
      @unsubscribe_url = "#{ENV['DEFAULT_URL']}/email_subscriptions/unsubscribe/#{subscription.cancel_token}"
      super(user_id, overview_url, skills_url, students_url)
    end

    private def subject = "🚀 Your #{@subscription.frequency.capitalize} Quill Admin Diagnostic Growth Report is Ready!"
  end
end
