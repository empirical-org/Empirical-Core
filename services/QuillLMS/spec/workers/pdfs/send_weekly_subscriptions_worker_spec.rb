# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Pdfs::SendWeeklySubscriptionsWorker, type: :worker do
  describe '#perform' do
    let(:num_weekly_subscriptions) { 2 }
    let(:num_monthly_subscriptions) { 1 }

    before do
      create_list(:pdf_subscription, num_weekly_subscriptions, frequency: PdfSubscription::WEEKLY)
      create_list(:pdf_subscription, num_monthly_subscriptions, frequency: PdfSubscription::MONTHLY)
    end

    it 'enqueues a job for each weekly subscription' do
      expect(Pdfs::AdminUsageSnapshotEmailWorker)
        .to receive(:perform_async)
        .exactly(num_weekly_subscriptions)
        .times

      subject.perform
    end
  end
end
