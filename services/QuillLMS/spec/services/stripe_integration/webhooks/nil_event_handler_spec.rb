# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::NilEventHandler do
  let(:stripe_webhook_event) { create(:unhandled_stripe_webhook_event) }
  let(:error_class) { described_class::UnhandledEventError }

  subject { described_class.run(stripe_webhook_event) }

  it do
    expect(stripe_webhook_event).to receive(:log_error)
    subject
  end
end
