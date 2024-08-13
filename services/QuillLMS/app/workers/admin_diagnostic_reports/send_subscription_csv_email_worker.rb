# frozen_string_literal: true

module AdminDiagnosticReports
  class SendSubscriptionCsvEmailWorker < SendCsvEmailWorker
    private def mailer = SubscriptionReportMailer

    private def email_payload
      @email_payload ||= [
        user.id,
        generate_overview_link,
        generate_skills_link,
        generate_students_link,
        EmailSubscription.find_by(user: user, subscription_type: EmailSubscription::ADMIN_DIAGNOSTIC_REPORT)
      ]
    end
  end
end
