# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::SubscriptionPaymentMethodsController, type: :request do
  let(:stripe_subscription_id) { "sub_#{SecureRandom.hex}" }
  let(:stripe_customer_id) { "cus_#{SecureRandom.hex}"}
  let(:update_payment_method) { allow(Stripe::Checkout::Session).to receive(:create) }
  let(:url) { '/stripe_integration/subscription_payment_methods' }
  let(:params) { { stripe_subscription_id: stripe_subscription_id, stripe_customer_id: stripe_customer_id} }
  let(:payment_method_session) { double(:payment_method_session, url: redirect_url) }
  let(:redirect_url) { '/subscriptions?stripe_payment_method_updated=true' }

  before { update_payment_method.and_return(payment_method_session) }

  it 'returns payload with redirect_url' do
    post url, params: params, as: :json

    expect(response.media_type).to eq 'application/json'
    expect(response).to have_http_status :ok
    expect(JSON.parse(response.body).symbolize_keys).to eq(redirect_url: redirect_url)
  end
end
