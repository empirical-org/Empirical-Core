# frozen_string_literal: true

module AdminDiagnosticReports
  class SendMonthlySubscriptionsWorker < SendSubscriptionsWorker
    private def subscriptions = EmailSubscription.monthly
  end
end
