# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class IgnoredEventHandler < EventHandler
      IGNORED_EVENT_NAMES = [
        'balance.available',
        'charge.captured',
        'charge.dispute.funds_withdrawn',
        'charge.failed',
        'charge.refunded',
        'charge.succeeded',
        'customer.created',
        'customer.source.created',
        'customer.source.deleted',
        'customer.source.expiring',
        'customer.source.updated',
        'customer.subscription.created',
        'customer.updated',
        'file.created',
        'invoice.created',
        'invoice.finalized',
        'invoice.payment_failed',
        'invoice.payment_succeeded',
        'invoice.sent',
        'invoice.updated',
        'invoice.voided',
        'invoiceitem.created',
        'invoiceitem.updated',
        'payment_intent.amount_capturable_updated',
        'payment_intent.canceled',
        'payment_intent.created',
        'payment_intent.payment_failed',
        'payment_intent.succeeded',
        'payment_method.attached',
        'payment_method.automatically_updated',
        'payout.created',
        'payout.paid',
        'product.updated',
        'quote.canceled',
        'quote.created',
        'quote.finalized',
        'setup_intent.created'
      ]

      EVENT_HANDLER_LOOKUP = IGNORED_EVENT_NAMES.to_h { |event_name| [event_name, self] }

      def run
        stripe_webhook_event.ignored!
      end
    end
  end
end
