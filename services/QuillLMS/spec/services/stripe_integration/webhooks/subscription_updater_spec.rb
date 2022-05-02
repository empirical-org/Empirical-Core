# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::SubscriptionUpdater do
  include_context 'Stripe Invoice'

  before { allow(stripe_subscription).to receive(:latest_invoice).and_return(stripe_invoice_id) }

  subject { described_class.run(stripe_subscription) }

  context 'turn renew off' do
    let!(:subscription) { create(:subscription, :recurring, stripe_invoice_id: stripe_invoice_id) }

    before { allow(stripe_subscription).to receive(:cancel_at_period_end).and_return(true) }

    it { expect { subject }.to change { subscription.reload.recurring }.from(true).to(false) }
  end

  context 'turn renew on' do
    let!(:subscription) { create(:subscription, :non_recurring, stripe_invoice_id: stripe_invoice_id) }

    before { allow(stripe_subscription).to receive(:cancel_at_period_end).and_return(false) }

    it { expect { subject }.to change { subscription.reload.recurring }.from(false).to(true) }
  end

  context 'cancel_at_period_end is nil on stripe' do
    let!(:subscription) { create(:subscription, stripe_invoice_id: stripe_invoice_id) }

    before { allow(stripe_subscription).to receive(:cancel_at_period_end).and_return(nil) }

    it { expect { subject }.to raise_error described_class::NilCancelAtPeriodEndError }
  end

  context 'no subscription exists in the db' do
    it { expect { subject }.to raise_error described_class::SubscriptionNotFoundError }
  end
end
