# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class InvoicePaidEventHandler < EventHandler
      PUSHER_EVENT = 'stripe-subscription-created'

      def run
        SubscriptionCreator.run(stripe_invoice, stripe_subscription)
        stripe_webhook_event.processed!
        PusherTrigger.run(stripe_invoice.id, PUSHER_EVENT, PUSHER_EVENT.titleize)
      rescue => e
        stripe_webhook_event.log_error(e)
      end

      private def stripe_invoice
        stripe_event.data.object
      end

      private def stripe_subscription
        @stripe_subscription ||= Stripe::Subscription.retrieve(stripe_invoice.subscription)
      end
    end
  end
end
