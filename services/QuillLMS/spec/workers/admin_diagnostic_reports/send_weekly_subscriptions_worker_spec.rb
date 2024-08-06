# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  RSpec.describe SendWeeklySubscriptionsWorker, type: :worker do
    subject { described_class.new.perform }

    let(:num_weekly_subscriptions) { 2 }
    let(:num_monthly_subscriptions) { 1 }

    before do
      create_list(:email_subscription, num_weekly_subscriptions, frequency: EmailSubscription::WEEKLY)
      create_list(:email_subscription, num_monthly_subscriptions, frequency: EmailSubscription::MONTHLY)
    end

    it 'enqueues a job for each weekly subscription' do
      expect(SendSubscriptionCsvEmailWorker)
        .to receive(:perform_async)
        .exactly(num_weekly_subscriptions)
        .times

      subject
    end
  end
end
