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

    subject { post url, params: params, as: :json }

    context 'happy path' do
      before { allow(StripeCheckoutSession).to receive(:custom_find_or_create_by!).and_return(stripe_checkout_session) }

      it 'creates a stripe checkout session and provides a redirect' do
        subject
        expect(response.body).to eq({ redirect_url: redirect_url }.to_json)
      end

      context 'customer already has stripe_customer_id attached' do
        before { customer.update(stripe_customer_id: stripe_customer_id) }

        it 'creates a stripe checkout session and provides a redirect' do
          subject
          expect(response.body).to eq({ redirect_url: redirect_url }.to_json)
        end
      end
    end

    context 'customer not found' do
      before { allow(User).to receive(:find_by_stripe_customer_id_or_email!).and_raise(ActiveRecord::RecordNotFound) }

      it { expect { subject }.to raise_error described_class::CustomerNotFoundError }
    end
  end
end
