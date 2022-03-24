# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::EventHandlerFactory do
  context '.for' do
    let(:null_object_handler) { StripeIntegration::Webhooks::NilEventHandler }

    it { expect(described_class.for(create(:unhandled_stripe_webhook_event)).class).to eq null_object_handler }

    described_class::EVENT_HANDLERS.each do |event_handler|
      context event_handler do
        let(:stripe_webhook_event) { create(:stripe_webhook_event, event_type: event_handler::EVENT_TYPE) }

        it { expect(described_class.for(stripe_webhook_event).class).to eq event_handler }
      end
    end
  end
end
