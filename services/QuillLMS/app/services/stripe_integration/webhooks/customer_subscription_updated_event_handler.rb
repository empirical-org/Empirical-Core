# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class CustomerSubscriptionUpdatedEventHandler < EventHandler
      EVENT_TYPE = 'customer.subscription.updated'

      def self.handles?(event_type)
        event_type == EVENT_TYPE
      end

      def run
        SubscriptionUpdater.run(stripe_event, previous_attributes)
        stripe_webhook_event.processed!
      rescue => e
        stripe_webhook_event.log_error(e)
      end

      private def previous_attributes
        return nil unless stripe_event.data.respond_to?(:previous_attributes)

        stripe_event.data.previous_attributes
      end

      private def stripe_subscription
        stripe_event.data.object
      end
    end
  end
end

