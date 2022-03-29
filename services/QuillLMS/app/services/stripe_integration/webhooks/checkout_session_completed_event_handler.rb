# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class CheckoutSessionCompletedEventHandler < EventHandler
      EVENT_TYPE = 'checkout.session.completed'

      def self.handles?(event_type)
        event_type == EVENT_TYPE
      end

      def run
        SubscriptionCreator.run(stripe_webhook_event.data)
        stripe_webhook_event.processed!
      rescue => e
        stripe_webhook_event.log_error(e)
      end
    end
  end
end
