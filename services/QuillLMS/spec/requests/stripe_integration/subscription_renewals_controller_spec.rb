# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::SubscriptionRenewalsController, type: :request do
  include_context 'Stripe Subscription'

  let(:stripe_subscription_id) { "sub_#{SecureRandom.hex}" }
  let(:cancel_at_period_end) { true }
  let(:args) { [stripe_subscription_id, cancel_at_period_end: cancel_at_period_end] }
  let(:update_stripe_subscription) { allow(Stripe::Subscription).to receive(:update).with(*args) }
  let(:url) { '/stripe_integration/subscription_renewals' }
  let(:params) { { stripe_subscription_id: stripe_subscription_id, cancel_at_period_end: cancel_at_period_end } }

  before { allow(Stripe::Subscription).to receive(:retrieve).with(stripe_subscription_id).and_return(stripe_subscription) }

  context 'Stripe Subscription exists' do
    before { update_stripe_subscription.and_return({}) }

    it 'returns 200 if the request to Stripe is successful' do
      post url, params: params, as: :json

      expect(response.media_type).to eq 'application/json'
      expect(response).to have_http_status :ok
    end
  end

  context 'Stripe Subscription exists but was canceled' do
    let(:stripe_subscription_status) { StripeIntegration::Subscription::CANCELED }

    it 'returns 500 since updates are not allowed on canceled subscriptions' do
      expect(ErrorNotifier)
        .to receive(:report)
        .with(described_class::UpdatingCanceledSubscriptionError, stripe_subscription_id: stripe_subscription_id)

      post url, params: params, as: :json

      expect(response.media_type).to eq 'application/json'
      expect(response).to have_http_status :internal_server_error
    end
  end

  context 'Stripe Subscription does not exist' do
    let(:error_msg) { "No such subscription: '#{stripe_subscription_id}'" }

    before { update_stripe_subscription.and_raise(Stripe::InvalidRequestError.new(error_msg, :id)) }

    it 'returns 500 if there are errors with the request to Stripe' do
      expect(ErrorNotifier)
        .to receive(:report)
        .with(Stripe::InvalidRequestError, stripe_subscription_id: stripe_subscription_id)

      post url, params: params, as: :json

      expect(response.media_type).to eq 'application/json'
      expect(response).to have_http_status :internal_server_error
    end
  end
end
