# frozen_string_literal: true

module AdminDiagnosticReports
  class SendWeeklySubscriptionsWorker < SendSubscriptionsWorker
    private def subscriptions = EmailSubscription.weekly
  end
end
