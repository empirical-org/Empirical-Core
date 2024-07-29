# frozen_string_literal: true

module AdminDiagnosticReports
  class SubscriptionReportMailer < ReportMailer
    def csv_download_email(user_id, overview_url, skills_url, students_url)
      @unsubscribe_url
      super
    end
  end
end
