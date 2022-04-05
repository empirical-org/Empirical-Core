# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class EventHandlerFactory
      EVENT_HANDLERS = [
        InvoicePaidEventHandler,
        IgnoredEventHandler
      ]

      def self.for(stripe_webhook_event)
        EVENT_HANDLERS
          .find(-> { UnknownEventHandler }) { |handler| handler.handles?(stripe_webhook_event.event_type) }
          .new(stripe_webhook_event)
      end
    end
  end
end
