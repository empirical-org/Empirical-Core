# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::User do
  include_context 'Stripe Payment Method'

  let(:user) { create(:user, stripe_customer_id: stripe_customer_id) }
  let(:stripe_user) { described_class.new(user) }

  describe '#last_four' do
    subject { stripe_user.last_four }

    context 'no stripe_customer_id' do
      let(:stripe_customer_id) { nil }

      it { expect(subject).to eq nil }
    end

    context 'stripe_customer_id exists' do
      let(:stripe_customer_id) { "cus_#{SecureRandom.hex}"}
      let(:stripe_customer) { double(:stripe_customer, customer_attrs) }
      let(:customer_attrs) { { invoice_settings: invoice_settings, sources: sources } }
      let(:invoice_settings) { double(:invoice_settings, default_payment_method: default_payment_method) }

      before do
        allow(Stripe::Customer)
          .to receive(:retrieve)
          .with(id: stripe_customer_id, expand: ['sources'])
          .and_return(stripe_customer)
      end

      context 'stripe_default_payment method exists' do
        let(:default_payment_method) { stripe_payment_method_id }
        let(:sources) { nil }

        before do
          allow(Stripe::PaymentMethod)
            .to receive(:retrieve)
            .with(stripe_payment_method_id)
            .and_return(stripe_payment_method)
        end

        it { expect(subject).to eq stripe_last_four }
      end

      context 'stripe_default_payment_method does not exist' do
        let(:default_payment_method) { nil }
        let(:sources) { double(:sources, data: data) }

        context 'stripe_customer_source does not exist' do
          let(:data) { nil }

          it { expect(subject).to eq nil }
        end

        context 'stripe_customer_source exists' do
          let(:data) { double(:data, first: card) }
          let(:card) { double(:card, last4: stripe_last_four) }

          it { expect(subject).to eq stripe_last_four }
        end
      end
    end
  end
end
