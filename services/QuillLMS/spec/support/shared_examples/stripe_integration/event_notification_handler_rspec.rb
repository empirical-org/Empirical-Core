# frozen_string_literal: true

require 'rails_helper'

RSpec.shared_context 'an event notification handler' do
  subject { described_class.run(stripe_webhook_event) }

  let(:stripe_webhook_event) { create(:stripe_webhook_event, event_type: stripe_event_type) }
  let(:external_id) { stripe_webhook_event.external_id }
  let(:mailer) { double(:stripe_mailer, deliver_now!: nil) }
  let(:mailer_action) { described_class::MAILER_ACTION }


  before { allow(Stripe::Event).to receive(:retrieve).with(external_id).and_return(stripe_event) }

  describe 'check for status change' do
    before do
      allow(StripeIntegration::Mailer).to receive(mailer_action).with(external_id).and_return(mailer)
      allow(mailer).to receive(:deliver_now!)
    end

    it { expect { subject }.to change(stripe_webhook_event, :status).to(StripeWebhookEvent::PROCESSED) }
  end

  it 'sends a notification' do
    mailer = double(:stripe_mailer, deliver_now!: nil)

    expect(StripeIntegration::Mailer).to receive(mailer_action).with(external_id).and_return(mailer)
    expect(mailer).to receive(:deliver_now!)

    subject
  end
end
