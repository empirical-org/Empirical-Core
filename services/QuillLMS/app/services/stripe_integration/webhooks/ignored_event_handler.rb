# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class IgnoredEventHandler < EventHandler
      IGNORED_EVENT_NAMES = [
        'balance.available',
        'charge.captured',
        'charge.dispute.funds_withdrawn',
        'charge.failed',
        'charge.pending',
        'charge.refunded',
        'charge.refund.updated',
        'charge.succeeded',
        'charge.updated',
        'checkout.session.async_payment_succeeded',
        'coupon.created',
        'coupon.deleted',
        'coupon.updated',
        'credit_note.created',
        'customer.created',
        'customer.deleted',
        'customer.discount.created',
        'customer.discount.deleted',
        'customer.source.created',
        'customer.source.deleted',
        'customer.source.expiring',
        'customer.source.updated',
        'customer.subscription.created',
        'customer.subscription.trial_will_end',
        'customer.updated',
        'file.created',
        'invoice.created',
        'invoice.deleted',
        'invoice.finalized',
        'invoice.payment_action_required',
        'invoice.payment_failed',
        'invoice.payment_succeeded',
        'invoice.sent',
        'invoice.updated',
        'invoice.upcoming',
        'invoice.voided',
        'invoiceitem.created',
        'invoiceitem.deleted',
        'invoiceitem.updated',
        'payment_intent.amount_capturable_updated',
        'payment_intent.canceled',
        'payment_intent.created',
        'payment_intent.payment_failed',
        'payment_intent.processing',
        'payment_intent.requires_action',
        'payment_intent.succeeded',
        'payment_method.attached',
        'payment_method.automatically_updated',
        'payment_method.detached',
        'payout.created',
        'payout.paid',
        'plan.created',
        'plan.deleted',
        'plan.updated',
        'price.created',
        'price.deleted',
        'price.updated',
        'product.created',
        'product.updated',
        'quote.accepted',
        'quote.canceled',
        'quote.created',
        'quote.finalized',
        'setup_intent.created',
        'setup_intent.requires_action',
        'setup_intent.setup_failed',
        'source.chargeable',
        'source.transaction.created',
        'tax_rate.created'
      ]

      EVENT_HANDLER_LOOKUP = IGNORED_EVENT_NAMES.to_h { |event_name| [event_name, self] }

      def run
        stripe_webhook_event.ignored!
      end
    end
  end
end
