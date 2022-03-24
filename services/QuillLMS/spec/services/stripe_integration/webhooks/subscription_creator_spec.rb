# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::SubscriptionCreator do
  include_context 'Stripe Checkout Session Completed Data'

  subject { described_class.run(data)}

  let!(:customer) { create(:user, email: customer_email, stripe_customer_id: stripe_customer_id) }
  let(:stub_subscription_retrieval) { allow(Stripe::Subscription).to receive(:retrieve).with(stripe_subscription_id) }
  let(:data) { JSON.parse(stripe_checkout_session_data).deep_symbolize_keys }

  before { stub_subscription_retrieval.and_return(stripe_subscription) }

  context 'happy path' do
    it { expect { subject }.to change(Subscription, :count).from(0).to(1) }
    it { expect { subject }.to change(UserSubscription, :count).from(0).to(1) }

    it 'calls sales contact background job' do
      expect(UpdateSalesContactWorker).to receive(:perform_async).with(customer.id, SalesStageType::TEACHER_PREMIUM)
      subject
    end
  end

  context 'nil stripe_subscription_id' do
    let(:data) { { subscription: nil } }

    it { expect { subject }.to raise_error described_class::NilStripeSubscriptionIdError }
  end

  context 'subscription already exists' do
    before { create(:subscription, stripe_subscription_id: stripe_subscription_id) }

    it { expect { subject }.to raise_error described_class::DuplicateSubscriptionError }
  end

  context 'plan does not exist' do
    before { allow(Plan).to receive(:find_by!).and_raise(ActiveRecord::RecordNotFound) }

    it { expect { subject }.to raise_error described_class::PlanNotFoundError }
  end

  context 'customer does not exist' do
    before { allow(User).to receive(:find_by!).and_raise(ActiveRecord::RecordNotFound) }

    it { expect { subject }.to raise_error described_class::PurchaserNotFoundError }
  end
end
