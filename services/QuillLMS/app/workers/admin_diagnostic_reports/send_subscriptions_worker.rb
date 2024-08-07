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
          AdminReportFilterSelection::DIAGNOSTIC_GROWTH_SUBSCRIPTION_SHARED,
          AdminReportFilterSelection::DIAGNOSTIC_GROWTH_SUBSCRIPTION_OVERVIEW,
          AdminReportFilterSelection::DIAGNOSTIC_GROWTH_SUBSCRIPTION_SKILLS,
          AdminReportFilterSelection::DIAGNOSTIC_GROWTH_SUBSCRIPTION_STUDENTS
        )
      end
    end

    private def subscriptions = (raise NotImplementedError)
  end
end

