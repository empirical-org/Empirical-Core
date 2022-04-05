# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class InvoicePaidEventHandler < EventHandler
      EVENT_TYPE = 'invoice.paid'

      def self.handles?(event_type)
        event_type == EVENT_TYPE
      end

      def run
        SubscriptionCreator.run(stripe_invoice, stripe_subscription)
        stripe_webhook_event.processed!
      rescue => e
        stripe_webhook_event.log_error(e)
      end

      private def stripe_invoice
        stripe_event.data.object
      end

      private def stripe_subscription
        Stripe::Subscription.retrieve(stripe_invoice.subscription)
      end
    end
  end
end
