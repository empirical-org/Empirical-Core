# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class IgnoredEventHandler < EventHandler
      IGNORED_EVENTS = [
        'balance.available',
        'charge.succeeded',
        'checkout.session.expired',
        'checkout.session.completed',
        'customer.created',
        'customer.source.created',
        'customer.source.updated',
        'customer.subscription.created',
        'customer.updated',
        'file.created',
        'invoice.updated',
        'invoice.created',
        'invoice.finalized',
        'invoice.payment_succeeded',
        'invoice.sent',
        'invoice.updated',
        'invoiceitem.created',
        'invoiceitem.updated',
        'payment_intent.cancelled',
        'payment_intent.created',
        'payment_intent.succeeded',
        'payment_method.attached',
        'payment_method.automatically_updated',
        'payout.created',
        'payout.paid',
        'setup_intent.created'
      ]

      def self.handles?(event_type)
        IGNORED_EVENTS.include?(event_type)
      end

      def run
        stripe_webhook_event.ignored!
      end
    end
  end
end


