# frozen_string_literal: true

require 'rails_helper'

describe RenewExpiringRecurringSubscriptionsWorker, type: :worker do
  let(:worker) { described_class.new }

  describe "#perform" do
    it "should trigger the Subscription model's recurring subscription update" do
      expect(Subscription).to receive(:update_todays_expired_recurring_subscriptions)
      worker.perform
    end
  end
end
