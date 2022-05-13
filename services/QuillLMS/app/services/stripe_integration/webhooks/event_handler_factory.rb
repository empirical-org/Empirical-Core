# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class EventHandlerFactory
      SINGLE_EVENT_HANDLER_CLASSES = [
        CustomerSubscriptionUpdatedEventHandler,
        InvoicePaidEventHandler,
        SetupIntentSucceededEventHandler
      ]

      SINGLE_EVENT_HANDLER_LOOKUP = SINGLE_EVENT_HANDLER_CLASSES.to_h { |klass| [klass.event_type, klass] }
      EVENT_HANDLER_LOOKUP = SINGLE_EVENT_HANDLER_LOOKUP.merge(IgnoredEventHandler::EVENT_HANDLER_LOOKUP)

      def self.for(stripe_webhook_event)
        EVENT_HANDLER_LOOKUP
          .fetch(stripe_webhook_event.event_type, UnknownEventHandler)
          .new(stripe_webhook_event)
      end
    end
  end
end
