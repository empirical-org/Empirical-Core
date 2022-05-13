# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::CustomerSubscriptionDeletedEventHandler do
  include_context 'Stripe Customer Subscription Deleted Event'

  let(:stripe_webhook_event) { create(:stripe_webhook_event, event_type: described_class::EVENT_TYPE) }
  let(:subscription_canceler_class) { StripeIntegration::Webhooks::SubscriptionCanceler}
  let(:external_id) { stripe_webhook_event.external_id }

  subject { described_class.run(stripe_webhook_event) }

  before { allow(Stripe::Event).to receive(:retrieve).with(external_id).and_return(stripe_event) }

  context 'happy path' do
    before { allow(subscription_canceler_class).to receive(:run).with(stripe_event) }

    it { expect { subject }.to change(stripe_webhook_event, :status).to(StripeWebhookEvent::PROCESSED) }
  end

  context 'error raised' do
    let(:error_class) { subscription_canceler_class::SubscriptionNotFoundError }

    before { allow(subscription_canceler_class).to receive(:run).and_raise(error_class) }

    it do
      expect(stripe_webhook_event).to receive(:log_error)
      subject
    end
  end
end
