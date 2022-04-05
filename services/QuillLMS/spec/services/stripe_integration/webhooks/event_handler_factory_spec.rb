# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::EventHandlerFactory do
  context '.for' do
    context 'Handled Events' do
      let(:event_handler) { StripeIntegration::Webhooks::InvoicePaidEventHandler }
      let(:stripe_webhook_event) { create(:invoice_paid_stripe_webhook_event) }

      it { expect(described_class.for(stripe_webhook_event).class).to eq event_handler }
    end

    context 'Ignored Events' do
      let(:event_handler) { StripeIntegration::Webhooks::IgnoredEventHandler }
      let(:event_type) { event_handler::IGNORED_EVENTS.sample }
      let(:stripe_webhook_event) { create(:stripe_webhook_event, event_type: event_type) }

      it { expect(described_class.for(stripe_webhook_event).class).to eq event_handler }
    end

    context 'Unknown Events' do
      let(:unknown_event_handler) { StripeIntegration::Webhooks::UnknownEventHandler }

      it { expect(described_class.for(create(:unknown_stripe_webhook_event)).class).to eq unknown_event_handler }
    end
  end
end
