# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::SubscriptionRenewalsController, type: :request do
  include_context 'Stripe Subscription'

  subject { post url, params: { stripe_subscription_id:, cancel_at_period_end: }, as: :json }

  let(:cancel_at_period_end) { true }
  let(:stripe_subscription_id) { "sub_#{SecureRandom.hex}" }
  let(:url) { '/stripe_integration/subscription_renewals' }

  before do
    allow(Stripe::Subscription)
      .to receive(:retrieve)
      .with(stripe_subscription_id)
      .and_return(stripe_subscription)
  end

  context 'Stripe Subscription exists' do
    before do
      allow(Stripe::Subscription)
        .to receive(:update)
        .with(stripe_subscription_id, { cancel_at_period_end: })
        .and_return({})
    end

    it 'returns 200 if the request to Stripe is successful' do
      subject

      expect(response.media_type).to eq 'application/json'
      expect(response).to have_http_status :ok
    end
  end

  context 'Stripe Subscription exists but was canceled' do
    let(:stripe_subscription_status) { StripeIntegration::Subscription::CANCELED }
    let(:error_class) { described_class::UpdatingCanceledSubscriptionError }

    it 'returns 500 since updates are not allowed on canceled subscriptions' do
      expect(ErrorNotifier).to receive(:report).with(error_class, stripe_subscription_id:)

      subject

      expect(response.media_type).to eq 'application/json'
      expect(response).to have_http_status :internal_server_error
    end
  end

  context 'Stripe Subscription does not exist' do
    let(:error_msg) { "No such subscription: '#{stripe_subscription_id}'" }
    let(:error_class) { Stripe::InvalidRequestError }

    before do
      allow(Stripe::Subscription)
        .to receive(:update)
        .with(stripe_subscription_id, { cancel_at_period_end: })
        .and_raise(error_class.new(error_msg, :id))
    end

    it 'returns 500 if there are errors with the request to Stripe' do
      expect(ErrorNotifier).to receive(:report).with(error_class, stripe_subscription_id:)

      subject

      expect(response.media_type).to eq 'application/json'
      expect(response).to have_http_status :internal_server_error
    end
  end
end
