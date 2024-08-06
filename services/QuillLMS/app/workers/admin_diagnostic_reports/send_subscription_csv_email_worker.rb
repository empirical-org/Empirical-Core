# frozen_string_literal: true

module AdminDiagnosticReports
  class SendSubscriptionCsvEmailWorker < SendCsvEmailWorker
    private def mailer = SubscriptionReportMailer

    private def email_payload
      @email_payload ||= [
        user.id,
        generate_overview_link(user.id, shared_filter_report_name, overview_filter_report_name),
        generate_skills_link(user.id, shared_filter_report_name, skills_filter_report_name),
        generate_students_link(user.id, shared_filter_report_name, students_filter_report_name),
        EmailSubscription.find_by(user: user, subscription_type: EmailSubscription::ADMIN_DIAGNOSTIC_REPORT)
      ]
    end
  end
end
