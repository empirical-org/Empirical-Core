# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::IgnoredEventHandler do
  let(:stripe_webhook_event) { create(:ignored_stripe_webhook_event) }
  let(:error_class) { described_class::IgnoredEventError }

  subject { described_class.run(stripe_webhook_event) }

  it { expect { subject }.to change(stripe_webhook_event, :status).to(StripeWebhookEvent::IGNORED) }
end
