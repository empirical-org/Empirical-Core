# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class CustomerSubscriptionDeletedEventHandler < EventHandler
      def run
        SubscriptionCanceler.run(stripe_subscription)
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
