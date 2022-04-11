# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::InvoicePaidEventHandler do
  include_context 'Stripe Event'
  include_context 'Stripe Customer'

  let(:stripe_webhook_event) { create(:stripe_webhook_event) }
  let(:external_id) { stripe_webhook_event.external_id }

  subject { described_class.run(stripe_webhook_event) }

  before do
    allow(Stripe::Event).to receive(:retrieve).with(external_id).and_return(stripe_event)
    allow(Stripe::Subscription).to receive(:retrieve).with(stripe_subscription_id).and_return(stripe_subscription)
  end

  context 'happy path' do
    let(:pusher_event) { described_class::PUSHER_EVENT }
    let(:pusher_message) { pusher_event.titleize }

    before do
      allow(StripeIntegration::Webhooks::SubscriptionCreator).to receive(:run)
      allow(PusherTrigger).to receive(:run).with(stripe_invoice_id, pusher_event, pusher_message)
    end

    it { expect { subject }.to change(stripe_webhook_event, :status).to(StripeWebhookEvent::PROCESSED) }
  end

  context 'raised errors' do
    let(:error_class) { StripeIntegration::Webhooks::SubscriptionCreator::Error.subclasses.sample }

    before { allow(StripeIntegration::Webhooks::SubscriptionCreator).to receive(:run).and_raise(error_class) }

    it do
      expect(stripe_webhook_event).to receive(:log_error)
      subject
    end
  end
end
