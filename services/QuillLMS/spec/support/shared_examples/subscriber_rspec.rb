# frozen_string_literal: true

require 'rails_helper'

RSpec.shared_examples 'a subscriber' do
  let(:factory_name) { described_class.to_s.underscore }
  let(:subscriber) { create(factory_name) }

  describe '.ever_paid_for_subscription?' do
    let(:subscription) { create(:subscription) }

    before { allow(subscriber).to receive(:subscriptions).and_return([subscription]) }

    it 'responds true if subscriber has subscription in the OFFICIAL_PAID_TYPES_LIST' do
      Subscription::OFFICIAL_PAID_TYPES.each do |account_type|
        subscription.update(account_type: account_type)
        expect(subscriber.ever_paid_for_subscription?).to be true
      end
    end

    it 'responds true if subscriber has subscription in the OFFICIAL_FREE_TYPES_LIST' do
      Subscription::OFFICIAL_FREE_TYPES.each do |account_type|
        subscription.update(account_type: account_type)
        expect(subscriber.ever_paid_for_subscription?).to be false
      end
    end
  end
end

