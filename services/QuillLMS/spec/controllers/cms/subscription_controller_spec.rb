# frozen_string_literal: true

require 'rails_helper'

describe Cms::SubscriptionsController do
  let(:user) { create(:staff) }

  before { allow(controller).to receive(:current_user) { user } }

  describe '#create' do
    let!(:school) { create(:school) }
    let(:subscription) { build(:subscription) }

    it 'should create the subscription' do
      post :create,
        params: {
          school_or_user_id: school.id,
          school_or_user: "school",
          subscription: subscription.attributes
        }

      expect(school.reload.subscriptions.last.expiration).to eq subscription.expiration
      expect(school.reload.subscriptions.last.recurring).to eq subscription.recurring
      expect(school.reload.subscriptions.last.payment_method).to eq subscription.payment_method
      expect(school.reload.subscriptions.last.payment_amount).to eq subscription.payment_amount
    end

    it 'should change current subscription to non-recurring' do
      subscription = create(:subscription, recurring: true)
      create(:school_subscription, school: school, subscription: subscription)

      new_subscription = Subscription.new(
        start_date: Subscription.redemption_start_date(school),
        expiration: Subscription.redemption_start_date(school) + 1.year
      )

      post :create,
        params: {
          school_or_user_id: school.id,
          school_or_user: "school",
          subscription: new_subscription.attributes
        }

      expect(subscription.reload.recurring).to eq(false)
    end
  end

  describe '#update' do
    let!(:subscription) { create(:subscription) }

    it 'should update the given subscription' do
      post :update,
        params: {
          id: subscription.id,
          subscription: {
            payment_amount: 100
          }
        }

      expect(subscription.reload.payment_amount).to eq 100
    end
  end
end
