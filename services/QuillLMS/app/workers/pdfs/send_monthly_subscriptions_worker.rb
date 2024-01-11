# frozen_string_literal: true

module Pdfs
  class MonthlySubscriptionsWorker
    include Sidekiq::Worker

    def perform
      PdfSubscription.monthly.find_each do |pdf_subscription|
        Pdfs::AdminUsageSnapshotEmailJob.perform_async(pdf_subscription.id)
      end
    end
  end
end
