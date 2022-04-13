# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Subscription do
  let(:subscription) { create(:subscription, stripe_invoice_id: stripe_invoice_id) }

  describe '#last_four' do
    subject { described_class.new(subscription).last_four }

    context 'nil stripe_invoice_id' do
      let(:stripe_invoice_id) { nil }

      it { expect(subject).to eq nil }
    end

    context 'stripe_invoice_id present' do
      include_context 'Stripe Invoice'

      let(:retrieve_invoice) { allow(Stripe::Invoice).to receive(:retrieve).with(stripe_invoice_id) }

      context 'stripe_invoice does not exist' do
        let(:invoice_error_msg) { "No such invoice: '#{stripe_invoice_id}'" }

        before { retrieve_invoice.and_raise(Stripe::InvalidRequestError.new(invoice_error_msg, :id)) }

        it { expect(subject).to eq nil }
      end

      context 'stripe_invoice exists' do
        before { retrieve_invoice.and_return(stripe_invoice) }

        let(:retrieve_subscription) { allow(Stripe::Subscription).to receive(:retrieve).with(stripe_subscription_id) }

        context 'stripe_subscription does not exist' do
          let(:subscription_error_msg) { "No such subscription: '#{stripe_subscription_id}'" }

          before { retrieve_subscription.and_raise(Stripe::InvalidRequestError.new(subscription_error_msg, :id)) }

          it { expect(subject).to eq nil }
        end

        context 'stripe_subscription exists' do
          before { retrieve_subscription.and_return(stripe_subscription) }

          let(:retrieve_payment_method) { allow(Stripe::PaymentMethod).to receive(:retrieve).with(stripe_payment_method_id) }

          context 'stripe_payment_method does not exist' do
            let(:payment_method_error_msg) { "No such payment method: '#{stripe_payment_method_id}'" }

            before { retrieve_payment_method.and_raise(Stripe::InvalidRequestError.new(payment_method_error_msg, :id)) }

            it { expect(subject).to eq nil }
          end

          context 'stripe_payment_method exists' do
            before { retrieve_payment_method.and_return(stripe_payment_method) }

            it { expect(subject).to eq last_four }
          end
        end
      end
    end
  end
end
