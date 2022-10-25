# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::ChargeDisputeClosedHandler do
  include_context 'Stripe Charge Dispute Closed Event'

  let(:stripe_webhook_event) { create(:stripe_webhook_event, event_type: stripe_event_type) }
  let(:external_id) { stripe_webhook_event.external_id }
  let(:mailer_method) { stripe_webhook_event.event_type.tr('.', '_') }
  let(:mailer) { double(:stripe_mailer, deliver_now!: nil) }

  subject { described_class.run(stripe_webhook_event) }

  before { allow(Stripe::Event).to receive(:retrieve).with(external_id).and_return(stripe_event) }

  context 'check for status change' do
    before do
      allow(StripeIntegration::Mailer).to receive(mailer_method).with(external_id).and_return(mailer)
      allow(mailer).to receive(:deliver_now!)
    end

    it { expect { subject }.to change(stripe_webhook_event, :status).to(StripeWebhookEvent::PROCESSED) }
  end

  it 'sends a notification' do
    expect(StripeIntegration::Mailer).to receive(mailer_method).with(external_id).and_return(mailer)
    expect(mailer).to receive(:deliver_now!)
    subject
  end
end
