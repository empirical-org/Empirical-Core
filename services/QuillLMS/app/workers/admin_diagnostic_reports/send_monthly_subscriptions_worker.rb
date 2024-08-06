# frozen_string_literal: true

module AdminDiagnosticReports
  class SendMonthlySubscriptionsWorker
    include Sidekiq::Worker

    def perform
      EmailSubscription.monthly.find_each do |subscription|
        Pdfs::AdminUsageSnapshotEmailWorker.perform_async(pdf_subscription.id)
      end
    end
  end
end

