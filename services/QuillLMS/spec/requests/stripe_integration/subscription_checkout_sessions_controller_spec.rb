# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::SubscriptionCheckoutSessionsController, type: :request do
  include_context 'Stripe Price'
  include_context 'Stripe Customer'

  describe '#create' do
    let(:stripe_checkout_session) { create(:stripe_checkout_session) }
    let(:redirect_url) { stripe_checkout_session.url }
    let(:params) { { customer_email: customer_email, stripe_price_id: stripe_price_id, school_ids: school_ids } }
    let(:url) { '/stripe_integration/subscription_checkout_sessions' }
    let(:school_ids) { nil }

    subject { post url, params: params, as: :json }

    context 'happy path' do
      before { allow(Stripe::Checkout::Session).to receive(:create).and_return(stripe_checkout_session) }

      it { should_create_stripe_checkout_session_and_provide_redirect }

      context 'customer already has stripe_customer_id attached' do
        before { customer.update(stripe_customer_id: stripe_customer_id) }

        it { should_create_stripe_checkout_session_and_provide_redirect }
      end

      context 'school ids are provided and customer is an admin' do
        let(:school) { create(:school) }
        let(:school_ids) { [school.id].to_json }

        before { customer.update(role: 'admin') }

        it { should_create_stripe_checkout_session_and_provide_redirect }
      end
    end

    context 'customer not found' do
      before { allow(User).to receive(:find_by_stripe_customer_id_or_email!).and_raise(ActiveRecord::RecordNotFound) }

      it { expect { subject }.to raise_error described_class::CustomerNotFoundError }
    end
  end

  def should_create_stripe_checkout_session_and_provide_redirect
    subject
    expect(response.body).to eq({ redirect_url: redirect_url }.to_json)
  end
end
