# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class InvoicePaidEventHandler < EventHandler
      PUSHER_EVENT = 'stripe-subscription-created'

      def run
        create_subscription unless manual_invoice? || refund_invoice?
        stripe_webhook_event.processed!
      rescue => e
        stripe_webhook_event.log_error(e)
      end

      private def create_subscription
        SubscriptionCreator.run(stripe_invoice, stripe_subscription)
        PusherTrigger.run(stripe_invoice.id, PUSHER_EVENT, PUSHER_EVENT.titleize)
      end

      private def manual_invoice?
        stripe_invoice.subscription.nil?
      end

      private def refund_invoice?
        stripe_invoice.amount_paid.zero?
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
