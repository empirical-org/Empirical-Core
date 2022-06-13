# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::SubscriptionCheckoutSessionsController, type: :request do
  include_context 'Stripe Price'
  include_context 'Stripe Customer'

  describe '#create' do
    let(:stripe_checkout_session) { create(:stripe_checkout_session) }
    let(:redirect_url) { stripe_checkout_session.url }
    let(:params) { { customer_email: customer_email, stripe_price_id: stripe_price_id } }
    let(:url) { '/stripe_integration/subscription_checkout_sessions' }

    before { allow(StripeCheckoutSession).to receive(:custom_find_or_create_by!).and_return(stripe_checkout_session) }

    it 'creates a stripe checkout session and provides a redirect' do
      post url, params: params, as: :json
      expect(response.body).to eq({ redirect_url: redirect_url }.to_json)
    end

    context 'customer already has stripe_customer_id attached' do
      before { customer.update(stripe_customer_id: stripe_customer_id) }

      it 'creates a stripe checkout session and provides a redirect' do
        post url, params: params, as: :json
        expect(response.body).to eq({ redirect_url: redirect_url }.to_json)
      end
    end
  end
end
