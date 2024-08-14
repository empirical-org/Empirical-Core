# frozen_string_literal: true

module AdminDiagnosticReports
  class SendSubscriptionsWorker
    include Sidekiq::Worker

    def perform
      subscriptions.find_each do |subscription|
        SendSubscriptionCsvEmailWorker.perform_async(
          subscription.user_id,
          AdminReportFilterSelection::DIAGNOSTIC_GROWTH_SUBSCRIPTION_SHARED,
          AdminReportFilterSelection::DIAGNOSTIC_GROWTH_SUBSCRIPTION_OVERVIEW,
          AdminReportFilterSelection::DIAGNOSTIC_GROWTH_SUBSCRIPTION_SKILL,
          AdminReportFilterSelection::DIAGNOSTIC_GROWTH_SUBSCRIPTION_STUDENT
        )
      end
    end

    private def subscriptions = (raise NotImplementedError)
  end
end
