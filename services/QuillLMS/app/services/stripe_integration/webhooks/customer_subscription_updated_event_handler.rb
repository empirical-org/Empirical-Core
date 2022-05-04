# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class CustomerSubscriptionUpdatedEventHandler < EventHandler
      EVENT_TYPE = 'customer.subscription.updated'
      PUSHER_EVENT = 'stripe-customer-subscription-updated'

      def self.handles?(event_type)
        event_type == EVENT_TYPE
      end

      def run
        SubscriptionUpdater.run(stripe_subscription)
        stripe_webhook_event.processed!
      rescue => e
        stripe_webhook_event.log_error(e)
      end

      private def stripe_subscription
        stripe_event.data.object
      end
    end
  end
end

