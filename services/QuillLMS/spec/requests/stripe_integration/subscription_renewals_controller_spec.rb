# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::SubscriptionRenewalsController, type: :request do
  let(:stripe_subscription_id) { "sub_#{SecureRandom.hex}" }
  let(:cancel_at_period_end) { true }
  let(:args) { [stripe_subscription_id, cancel_at_period_end: cancel_at_period_end] }
  let(:update_stripe_subscription) { allow(Stripe::Subscription).to receive(:update).with(*args) }
  let(:url) { '/stripe_integration/subscription_renewals' }
  let(:params) { { stripe_subscription_id: stripe_subscription_id, cancel_at_period_end: cancel_at_period_end } }

  context 'Stripe Subscription exists' do
    before { update_stripe_subscription.and_return({}) }

    it 'returns 200 if the request to Stripe is successful' do
      post url, params: params, as: :json

      expect(response.content_type).to eq 'application/json'
      expect(response).to have_http_status :ok
    end
  end

  context 'Stripe Subscription does not exist' do
    let(:error_msg) { "No such subscription: '#{stripe_subscription_id}'" }

    before { update_stripe_subscription.and_raise(Stripe::InvalidRequestError.new(error_msg, :id)) }

    it 'returns 500 if there are errors with the request to Stripe' do
      post url, params: params, as: :json

      expect(response.content_type).to eq 'application/json'
      expect(response).to have_http_status :internal_server_error
    end
  end
end
