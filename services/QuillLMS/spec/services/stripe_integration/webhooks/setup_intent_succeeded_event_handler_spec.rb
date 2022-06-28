# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::SetupIntentSucceededEventHandler do
  include_context 'Stripe Setup Intent Succeeded Event'

  let(:stripe_webhook_event) { create(:stripe_webhook_event, event_type: stripe_event_type) }
  let(:external_id) { stripe_webhook_event.external_id }

  subject { described_class.run(stripe_webhook_event) }

  before  { allow(Stripe::Event).to receive(:retrieve).with(external_id).and_return(stripe_event) }

  context 'happy path' do
    before do
      allow(PusherTrigger).to receive(:run).with(stripe_subscription_id, pusher_event, pusher_message)

      allow(Stripe::Subscription)
        .to receive(:update)
        .with(stripe_subscription_id, default_payment_method: stripe_payment_method_id)
    end

    let(:pusher_event) { described_class::PUSHER_EVENT }
    let(:pusher_message) { pusher_event.titleize }

    it { expect { subject }.to change(stripe_webhook_event, :status).to(StripeWebhookEvent::PROCESSED) }
  end

  context 'metadata does not respond to subscription_id' do
    let(:metadata) { double(:metadata) }

    before do
      allow(stripe_setup_intent).to receive(:metadata).and_return(metadata)
      allow(metadata).to receive(:respond_to?).with(:subscription_id).and_return(false)
    end

    it 'does not update stripe nor trigger Pusher' do
      expect(Stripe::Subscription).not_to receive(:update)
      expect(PusherTrigger).not_to receive(:run)

      subject
    end
  end

  context 'stripe_subscription_id is nil' do
    let(:stripe_subscription_id) { nil }

    it 'does not update stripe nor trigger Pusher' do
      expect(Stripe::Subscription).not_to receive(:update)
      expect(PusherTrigger).not_to receive(:run)

      subject
    end
  end
end
