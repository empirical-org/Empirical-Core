# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Subscription do
  include_context 'Stripe Invoice'

  let(:subscription) { create(:subscription, stripe_invoice_id: stripe_invoice_id) }

  describe '#last_four' do
    subject { described_class.new(subscription).last_four }

    let(:retrieve_invoice) { allow(Stripe::Invoice).to receive(:retrieve).with(stripe_invoice_id) }
    let(:retrieve_subscription) { allow(Stripe::Subscription).to receive(:retrieve).with(stripe_subscription_id) }
    let(:retrieve_payment_method) { allow(Stripe::PaymentMethod).to receive(:retrieve).with(stripe_payment_method_id) }

    context 'happy path' do
      before do
        retrieve_invoice.and_return(stripe_invoice)
        retrieve_subscription.and_return(stripe_subscription)
        retrieve_payment_method.and_return(stripe_payment_method)
      end

      it { expect(subject).to eq stripe_last_four }
    end

    context 'nil stripe_invoice_id' do
      let(:stripe_invoice_id) { nil }

      it { expect(subject).to eq nil }
    end

    context 'stripe_invoice does not exist' do
      let(:invoice_error_msg) { "No such invoice: '#{stripe_invoice_id}'" }

      before { retrieve_invoice.and_raise(Stripe::InvalidRequestError.new(invoice_error_msg, :id)) }

      it { expect(subject).to eq nil }
    end

    context 'stripe_subscription does not exist' do
      let(:subscription_error_msg) { "No such subscription: '#{stripe_subscription_id}'" }

      before do
        retrieve_invoice.and_return(stripe_invoice)
        retrieve_subscription.and_raise(Stripe::InvalidRequestError.new(subscription_error_msg, :id))
      end

      it { expect(subject).to eq nil }
    end

    context 'stripe_payment_method does not exist' do
      let(:payment_method_error_msg) { "No such payment method: '#{stripe_payment_method_id}'" }

      let(:retrieve_source) do
        allow(Stripe::PaymentMethod).to receive(:list).with(customer: stripe_customer_id, type: 'card')
      end

      before do
        retrieve_invoice.and_return(stripe_invoice)
        retrieve_subscription.and_return(stripe_subscription)
        retrieve_payment_method.and_raise(Stripe::InvalidRequestError.new(payment_method_error_msg, :id))
      end

      context 'stripe_source does not exist' do
        let(:source_error_msg) { 'No such source' }

        before { retrieve_source.and_raise(Stripe::InvalidRequestError.new(source_error_msg, :id)) }

        it { expect(subject).to eq nil }
      end

      context 'stripe_source exists' do
        include_context 'Stripe Sources'

        before { retrieve_source.and_return(stripe_sources) }

        it { expect(subject).to eq stripe_last_four }
      end
    end
  end
end
