# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::ChargeDisputeCreatedHandler do
  include_context 'Stripe Charge Dispute Created Event'

  let(:stripe_webhook_event) { create(:stripe_webhook_event, event_type: stripe_event_type) }
  let(:external_id) { stripe_webhook_event.external_id }

  subject { described_class.run(stripe_webhook_event) }

  before { allow(Stripe::Event).to receive(:retrieve).with(external_id).and_return(stripe_event) }

  it { expect { subject }.to change(stripe_webhook_event, :status).to(StripeWebhookEvent::PROCESSED) }

  it 'sends a notification' do
    expect(StripeIntegration::Mailer).to receive(:charge_dispute_created)
    subject
  end
end
