# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class InvoicePaidEventHandler < EventHandler
      ACTIVE = 'active'
      PUSHER_EVENT = 'stripe-subscription-created'

      def run
        create_subscription
        stripe_webhook_event.processed!
      rescue => e
        stripe_webhook_event.log_error(e)
      end

      private def active_subscription?
        stripe_subscription.respond_to?(:status) && stripe_subscription.status == ACTIVE
      end

      private def create_subscription
        return if manual_invoice?
        return unless active_subscription?

        SubscriptionCreator.run(stripe_invoice, stripe_subscription)
        PusherTrigger.run(stripe_invoice.id, PUSHER_EVENT, PUSHER_EVENT.titleize)
      end

      private def manual_invoice?
        stripe_invoice.subscription.nil?
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
