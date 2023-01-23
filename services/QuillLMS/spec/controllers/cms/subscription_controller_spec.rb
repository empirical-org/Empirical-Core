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
          subscriber_id: school.id,
          subscriber_type: 'School',
          subscription: subscription.attributes
        }

      expect(school.reload.subscriptions.last.expiration).to eq subscription.expiration
      expect(school.reload.subscriptions.last.recurring).to eq subscription.recurring
      expect(school.reload.subscriptions.last.payment_method).to eq subscription.payment_method
      expect(school.reload.subscriptions.last.payment_amount).to eq subscription.payment_amount
    end

    it 'should call populate_data_from_stripe_invoice to try to auto-populate data' do
      expect_any_instance_of(Subscription).to receive(:populate_data_from_stripe_invoice)      
      post :create,
        params: {
          subscriber_id: school.id,
          subscriber_type: 'School',
          subscription: subscription.attributes
        }
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
          subscriber_id: school.id,
          subscriber_type: 'School',
          subscription: new_subscription.attributes
        }

      expect(subscription.reload.recurring).to eq(false)
    end
  end

  describe '#edit' do
    context 'stripe' do
      let(:subscription) { create(:subscription, :stripe) }
      let(:stripe_subscription_id) { "sub_#{SecureRandom.hex}"}
      let(:stripe_invoice_id) { subscription.stripe_invoice_id }
      let(:stripe_invoice) { double(:stripe_invoice, subscription: stripe_subscription_id) }

      before do
        allow(Stripe::Invoice).to receive(:retrieve).with(stripe_invoice_id).and_return(stripe_invoice)
        stub_request(:get, %r{https://api.stripe.com/v1/}).to_return(status: :found)
      end

      it 'redirects to the stripe dashboard' do
        get :edit, params: { id: subscription.id }
        expect(response).to have_http_status :found
      end
    end

    context 'non stripe' do
      let(:subscription) { create(:subscription) }

      it 'redirects to the subscription edit view' do
        get :edit, params: { id: subscription.id }
        expect(response).to have_http_status :ok
      end
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
