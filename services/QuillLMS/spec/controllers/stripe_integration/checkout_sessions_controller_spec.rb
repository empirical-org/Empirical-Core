# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::CheckoutSessionsController, type: :controller do
  describe '#create' do
    let(:redirect_url) { '/some_redirect_url' }
    let(:stripe_checkout_session) { double(:stripe_checkout_session, url: redirect_url) }

    let(:params) do
      {
        customer_email: 'customer@example.com',
        stripe_customer_id: 'cus_aasdf23423',
        price_id: 'price_asdjf233423'
      }
    end

    before { allow(Stripe::Checkout::Session).to receive(:create).and_return(stripe_checkout_session) }

    it 'creates a stripe checkout session and provides a redirect' do
      post :create, params: params
      expect(response.body).to eq({ redirect_url: redirect_url }.to_json)
    end
  end
end
