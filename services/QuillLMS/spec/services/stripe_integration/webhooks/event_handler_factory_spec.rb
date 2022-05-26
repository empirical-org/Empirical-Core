# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::EventHandlerFactory do
  context '.for' do
    described_class::SINGLE_EVENT_HANDLER_LOOKUP.each_pair do |event_type, event_handler|
      context event_handler.to_s do
        let(:stripe_webhook_event) { create(:stripe_webhook_event, event_type: event_type) }

        it { expect(described_class.for(stripe_webhook_event).class).to eq event_handler }
      end
    end

    context 'Ignored Events' do
      let(:event_handler) { StripeIntegration::Webhooks::IgnoredEventHandler }
      let(:event_type) { event_handler::IGNORED_EVENT_NAMES.sample }
      let(:stripe_webhook_event) { create(:stripe_webhook_event, event_type: event_type) }

      it { expect(described_class.for(stripe_webhook_event).class).to eq event_handler }
    end

    context 'Unknown Events' do
      let(:unknown_event_handler) { StripeIntegration::Webhooks::UnknownEventHandler }

      it { expect(described_class.for(create(:unknown_stripe_webhook_event)).class).to eq unknown_event_handler }
    end
  end
end
