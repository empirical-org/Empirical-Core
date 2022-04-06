module StripeIntegration
  module Webhooks
    class CheckoutSessionCompletedEventHandler < EventHandler
      EVENT_TYPE = 'checkout.session.completed'

      def self.handles?(event_type)
        event_type == EVENT_TYPE
      end

      def run
        SubscriptionCreator.run(stripe_invoice, stripe_subscription)
        stripe_webhook_event.processed!
      rescue => e
        stripe_webhook_event.log_error(e)
      end

      private def stripe_checkout_session
        stripe_event.data.object
      end

      private def stripe_subscription
        Stripe::Subscription.retrieve(stripe_invoice.subscription)
      end

      # private deef
    end
  end
end
