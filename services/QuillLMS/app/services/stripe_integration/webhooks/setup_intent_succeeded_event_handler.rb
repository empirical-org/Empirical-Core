# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class SetupIntentSucceededEventHandler < EventHandler
      PUSHER_EVENT = 'stripe-subscription-payment-method-updated'

      def run
        Stripe::Subscription.update(stripe_subscription_id, default_payment_method: stripe_payment_method_id)
        stripe_webhook_event.processed!
        PusherTrigger.run(stripe_subscription_id, PUSHER_EVENT, PUSHER_EVENT.titleize)
      rescue => e
        stripe_webhook_event.log_error(e)
      end

      private def stripe_setup_intent
        stripe_event.data.object
      end

      private def stripe_payment_method_id
        stripe_setup_intent.payment_method
      end

      private def stripe_subscription_id
        stripe_setup_intent&.metadata&.subscription_id
      end
    end
  end
end
