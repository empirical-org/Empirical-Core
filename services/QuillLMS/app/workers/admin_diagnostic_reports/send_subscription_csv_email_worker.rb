# frozen_string_literal: true

module AdminDiagnosticReports
  class SendSubscriptionCsvEmailWorker < SendCsvEmailWorker
    private def mailer = SubscriptionReportMailer
  end
end
