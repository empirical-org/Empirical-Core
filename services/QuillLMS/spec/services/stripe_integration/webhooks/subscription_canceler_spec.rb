# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::SubscriptionCanceler do
  include_context 'Stripe Invoice'

  before do
    allow(stripe_subscription).to receive(:latest_invoice).and_return(stripe_invoice_id)
    allow(stripe_subscription).to receive(:canceled_at).and_return(canceled_at)
  end

  subject { described_class.run(stripe_subscription) }

  context 'canceled_at is nil' do
    let(:canceled_at) { nil }

    it { expect { subject }.to raise_error described_class::NilCanceledAtError }
  end

  context 'canceled_at is not nil' do
    let(:canceled_at) { Time.current.to_i }

    context 'subscription not found' do
      it { expect { subject }.to raise_error described_class::SubscriptionNotFoundError }
    end

    context 'subscription found' do
      let!(:subscription) { create(:subscription, recurring: true, stripe_invoice_id: stripe_invoice_id) }

      it { expect { subject }.to change { subscription.reload.recurring }.from(true).to(false) }
      it { expect { subject }.to change { subscription.reload.expiration }.to(Date.current) }
    end
  end
end
