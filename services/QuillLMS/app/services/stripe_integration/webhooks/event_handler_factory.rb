# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class EventHandlerFactory
      SINGLE_EVENT_HANDLERS = [
        CustomerSubscriptionUpdatedEventHandler,
        InvoicePaidEventHandler,
        SetupIntentSucceededEventHandler
      ]

      EVENT_HANDLERS = SINGLE_EVENT_HANDLERS + [IgnoredEventHandler]

      def self.for(stripe_webhook_event)
        EVENT_HANDLERS
          .find(-> { UnknownEventHandler }) { |handler| handler.handles?(stripe_webhook_event.event_type) }
          .new(stripe_webhook_event)
      end
    end
  end
end
