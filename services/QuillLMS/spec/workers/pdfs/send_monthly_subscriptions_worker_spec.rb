# frozen_string_literal: true

require 'rails_helper'

module Pdfs
  RSpec.describe SendMonthlySubscriptionsWorker, type: :worker do
    subject { described_class.new.perform }

    let(:num_weekly_subscriptions) { 1 }
    let(:num_monthly_subscriptions) { 2 }

    before do
      create_list(:pdf_subscription, num_weekly_subscriptions, frequency: PdfSubscription::WEEKLY)
      create_list(:pdf_subscription, num_monthly_subscriptions, frequency: PdfSubscription::MONTHLY)
    end

    it 'enqueues a job for each monthly subscription' do
      expect(Pdfs::AdminUsageSnapshotEmailWorker)
        .to receive(:perform_async)
        .exactly(num_monthly_subscriptions)
        .times

      subject
    end
  end
end
