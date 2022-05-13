# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::CustomerSubscriptionUpdatedEventHandler do
  include_context 'Stripe Customer Subscription Updated Event'

  let(:stripe_webhook_event) { create(:stripe_webhook_event, event_type: stripe_event_type) }
  let(:subscription_updater_class) { StripeIntegration::Webhooks::SubscriptionUpdater }
  let(:external_id) { stripe_webhook_event.external_id }
  let(:previous_attributes) { nil }

  subject { described_class.run(stripe_webhook_event) }

  before { allow(Stripe::Event).to receive(:retrieve).with(external_id).and_return(stripe_event) }

  context 'happy path' do
    before { allow(subscription_updater_class).to receive(:run).with(stripe_event, previous_attributes) }

    it { expect { subject }.to change(stripe_webhook_event, :status).to(StripeWebhookEvent::PROCESSED) }
  end

  context 'error raised' do
    let(:error_class) { subscription_updater_class::SubscriptionNotFoundError }

    before { allow(subscription_updater_class).to receive(:run).and_raise(error_class) }

    it do
      expect(stripe_webhook_event).to receive(:log_error)
      subject
    end
  end
end
