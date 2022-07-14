# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class SetupIntentSucceededEventHandler < EventHandler
      PUSHER_EVENT = 'stripe-subscription-payment-method-updated'

      def run
        update_default_payment_method
        stripe_webhook_event.processed!
      rescue => e
        stripe_webhook_event.log_error(e)
      end

      private def metadata
        stripe_setup_intent&.metadata
      end

      private def stripe_setup_intent
        stripe_event.data.object
      end

      private def stripe_payment_method_id
        stripe_setup_intent.payment_method
      end

      private def stripe_subscription_id
        return nil unless metadata.respond_to?(:subscription_id)

        metadata.subscription_id
      end

      private def update_default_payment_method
        return if stripe_subscription_id.nil?

        Stripe::Subscription.update(stripe_subscription_id, default_payment_method: stripe_payment_method_id)
        PusherTrigger.run(stripe_subscription_id, PUSHER_EVENT, PUSHER_EVENT.titleize)
      end
    end
  end
end
