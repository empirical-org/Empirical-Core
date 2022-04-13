# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::UnknownEventHandler do
  let(:stripe_webhook_event) { create(:unknown_stripe_webhook_event) }
  let(:error_class) { described_class::UnknownEventError }

  subject { described_class.run(stripe_webhook_event) }

  it { expect { subject }.to change(stripe_webhook_event, :status).to(StripeWebhookEvent::FAILED) }

  it do
    expect(stripe_webhook_event).to receive(:log_error)
    subject
  end
end
