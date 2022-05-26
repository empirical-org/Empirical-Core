# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class CustomerSubscriptionDeletedEventHandler < EventHandler
      def run
        SubscriptionCanceler.run(stripe_event)
        stripe_webhook_event.processed!
      rescue => e
        stripe_webhook_event.log_error(e)
      end
    end
  end
end
