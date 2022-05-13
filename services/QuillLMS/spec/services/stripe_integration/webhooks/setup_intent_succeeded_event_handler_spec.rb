# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::SetupIntentSucceededEventHandler do
  include_context 'Stripe Setup Intent Succeeded Event'

  let(:stripe_webhook_event) { create(:stripe_webhook_event, event_type: described_class.event_type) }
  let(:external_id) { stripe_webhook_event.external_id }

  subject { described_class.run(stripe_webhook_event) }

  before do
    allow(Stripe::Event).to receive(:retrieve).with(external_id).and_return(stripe_event)

    allow(Stripe::Subscription)
      .to receive(:update)
      .with(stripe_subscription_id, default_payment_method: stripe_payment_method_id)
  end

  context 'happy path' do
    let(:pusher_event) { described_class::PUSHER_EVENT }
    let(:pusher_message) { pusher_event.titleize }

    before { allow(PusherTrigger).to receive(:run).with(stripe_subscription_id, pusher_event, pusher_message) }

    it { expect { subject }.to change(stripe_webhook_event, :status).to(StripeWebhookEvent::PROCESSED) }
  end
end
