# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::StripeInvoiceIdFinder do

  subject { described_class.run(checkout_session_id) }

  context 'nil checkout_session_id' do
    let(:checkout_session_id) { nil }

    it { expect(subject).to eq nil }
  end

  context 'valid checkout_session_id' do
    let(:checkout_session_id) { "cs_#{SecureRandom.hex}" }
    let(:retrieve_checkout_session) { allow(Stripe::Checkout::Session).to receive(:retrieve).with(checkout_session_id) }

    context 'checkout_session does not exist' do
      let(:error_msg) { "No such checkout_session: '#{checkout_session_id}'" }

      before { retrieve_checkout_session.and_raise(Stripe::InvalidRequestError.new(error_msg, :id)) }

      it { expect(subject).to eq nil }
    end

    context 'checkout_session exists' do
      let(:stripe_subscription_id) { "sub_#{SecureRandom.hex}" }
      let(:checkout_session) { double(:checkout_session, subscription: stripe_subscription_id) }
      let(:retrieve_subscription) { allow(Stripe::Subscription).to receive(:retrieve).with(stripe_subscription_id) }

      before { retrieve_checkout_session.and_return(checkout_session) }

      context 'subscription does not exist' do
        let(:error_msg) { "No such subscription: '#{stripe_subscription_id}'" }

        before { retrieve_subscription.and_raise(Stripe::InvalidRequestError.new(error_msg, :id)) }

        it { expect(subject).to eq nil }
      end

      context 'subscription exists' do
        let(:stripe_invoice_id) { "in_#{SecureRandom.hex}"}
        let(:stripe_subscription) { double(:stripe_subscription, latest_invoice: stripe_invoice_id) }

        before { retrieve_subscription.and_return(stripe_subscription) }

        it { expect(subject).to eq stripe_invoice_id }
      end
    end
  end
end
