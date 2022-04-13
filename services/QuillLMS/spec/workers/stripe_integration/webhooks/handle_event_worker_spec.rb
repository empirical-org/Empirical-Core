# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeIntegration::Webhooks::HandleEventWorker do
  let(:event_handler_factory) { described_class.parent::EventHandlerFactory }

  subject { described_class.new.perform(stripe_webhook_event_id) }

  context 'stripe_webhook_event_id is nil' do
    let(:stripe_webhook_event_id) { nil }

    it 'does not run event handling' do
      expect(event_handler_factory).not_to receive(:for)
      subject
    end
  end

  context 'stripe_webhook_event does not exist' do
    let(:stripe_webhook_event_id) { 0 }

    it 'does not run event handling' do
      expect(event_handler_factory).not_to receive(:for)
      subject
    end
  end

  context 'event handling is run' do
    let(:stripe_webhook_event) { create(:stripe_webhook_event) }
    let(:stripe_webhook_event_id) { stripe_webhook_event.id }
    let(:event_handler) { double(:event_handler, run: nil) }

    it 'runs event handler' do
      expect(event_handler_factory).to receive(:for).with(stripe_webhook_event).and_return(event_handler)
      subject
    end
  end
end
