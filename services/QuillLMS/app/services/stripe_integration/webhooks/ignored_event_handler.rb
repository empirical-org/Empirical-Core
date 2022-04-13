# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class IgnoredEventHandler < EventHandler
      IGNORED_EVENTS = [
        'charge.succeeded',
        'customer.created',
        'customer.source.created',
        'customer.subscription.updated',
        'customer.updated',
        'invoice.updated',
        'invoice.created',
        'invoice.finalized',
        'invoice.payment_succeeded',
        'invoice.sent',
        'invoice.updated',
        'invoiceitem.created',
        'invoiceitem.updated',
        'payment_intent.created',
        'payment_intent.succeeded',
        'payment_method.attached'
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



