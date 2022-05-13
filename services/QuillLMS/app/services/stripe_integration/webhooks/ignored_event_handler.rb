# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class IgnoredEventHandler < EventHandler
      IGNORED_EVENT_NAMES = [
        'balance.available',
        'charge.failed',
        'charge.refunded',
        'charge.succeeded',
        'checkout.session.expired',
        'checkout.session.completed',
        'customer.created',
        'customer.source.created',
        'customer.source.expiring',
        'customer.source.updated',
        'customer.subscription.created',
        'customer.updated',
        'file.created',
        'invoice.updated',
        'invoice.created',
        'invoice.finalized',
        'invoice.payment_failed',
        'invoice.payment_succeeded',
        'invoice.sent',
        'invoice.updated',
        'invoice.voided',
        'invoiceitem.created',
        'invoiceitem.updated',
        'payment_intent.cancelled',
        'payment_intent.created',
        'payment_intent.payment_failed',
        'payment_intent.succeeded',
        'payment_method.attached',
        'payment_method.automatically_updated',
        'payout.created',
        'payout.paid',
        'product.updated',
        'setup_intent.created',
        'setup_intent.succeeded'
      ]

      EVENT_HANDLER_LOOKUP = IGNORED_EVENT_NAMES.to_h { |event_name| [event_name, self] }

      def run
        stripe_webhook_event.ignored!
      end
    end
  end
end
