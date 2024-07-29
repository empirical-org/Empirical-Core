# frozen_string_literal: true

module AdminDiagnosticReports
  class SendWeeklySubscriptionsWorker
    include Sidekiq::Worker

    def perform
      EmailSubscription.weekly.find_each do |subscription|
        Pdfs::AdminUsageSnapshotEmailWorker.perform_async(pdf_subscription.id)
      end
    end
  end
end

