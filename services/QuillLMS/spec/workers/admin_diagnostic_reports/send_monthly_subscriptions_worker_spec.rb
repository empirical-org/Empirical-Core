# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  RSpec.describe SendMonthlySubscriptionsWorker, type: :worker do
    subject { described_class.new.perform }

    let(:num_weekly_subscriptions) { 1 }
    let(:num_monthly_subscriptions) { 2 }

    let(:user) { create(:admin) }

    before do
      create_list(:email_subscription, num_weekly_subscriptions, user:, frequency: EmailSubscription::WEEKLY)
      create_list(:email_subscription, num_monthly_subscriptions, user:, frequency: EmailSubscription::MONTHLY)
    end

    it 'enqueues a job for each weekly subscription' do
      expect(SendSubscriptionCsvEmailWorker)
        .not_to receive(:perform_async)

      subject
    end

    context 'user is premium' do
      let(:school) { create(:school) }
      let(:subscription) { create(:subscription) }

      before do
        create(:schools_users, school:, user:)
        create(:school_subscription, school:, subscription:)
      end

      it 'enqueues a job for each monthly subscription' do
        expect(SendSubscriptionCsvEmailWorker)
          .to receive(:perform_async)
          .exactly(num_monthly_subscriptions)
          .times
  
        subject
      end
    end
  end
end
