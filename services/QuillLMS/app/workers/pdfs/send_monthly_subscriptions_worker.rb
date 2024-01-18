# frozen_string_literal: true

module Pdfs
  class SendMonthlySubscriptionsWorker
    include Sidekiq::Worker

    def perform
      PdfSubscription.monthly.find_each do |pdf_subscription|
        Pdfs::AdminUsageSnapshotEmailWorker.perform_async(pdf_subscription.id)
      end
    end
  end
end
