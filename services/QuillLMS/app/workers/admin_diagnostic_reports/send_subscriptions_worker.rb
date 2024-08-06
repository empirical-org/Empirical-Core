# frozen_string_literal: true

module AdminDiagnosticReports
  class SendSubscriptionsWorker
    include Sidekiq::Worker

    SHARED_FILTER_REPORT_NAME = 'diagnostic_growth_report_subscription'
    OVERVIEW_FILTER_REPORT_NAME = 'diagnostic_growth_report_subscription_overview'
    SKILLS_FILTER_REPORT_NAME = 'diagnostic_growth_report_subscription_skill'
    STUDENTS_FILTER_REPORT_NAME = 'diagnostic_growth_report_subscription_student'

    def perform
      subscriptions.find_each do |subscription|
        SendSubscriptionCsvEmailWorker.perform_async(
          subscription.user_id,
          SHARED_FILTER_REPORT_NAME,
          OVERVIEW_FILTER_REPORT_NAME,
          SKILLS_FILTER_REPORT_NAME,
          STUDENTS_FILTER_REPORT_NAME
        )
      end
    end

    private def subscriptions = (raise NotImplementedError)
  end
end

