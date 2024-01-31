# frozen_string_literal: true

class IdentifyStripeInvoicesWithoutSubscriptionsWorker
  include Sidekiq::Worker

  FAILED_CHARGE = 'failed'
  INVOICE_START_EPOCH = DateTime.new(2023,1,1).to_i # Date we began using this workflow
  RELEVANT_INVOICE_STATUSES = ['open', 'paid'].freeze

  def perform
    StripeIntegration::Mailer
      .invoices_without_subscriptions(invoice_payloads)
      .deliver_now!
  end

  private def charge_failed?(invoice)
    return false unless invoice.charge

    charge = Stripe::Charge.retrieve(invoice.charge)
    charge.status == FAILED_CHARGE
  end

  private def invoice_payloads
    relevant_stripe_invoices.map do |invoice|
      {
        id: invoice.id,
        created: Time.at(invoice.created).getlocal.to_datetime,
        total: invoice.total / 100.0,
        customer_name: invoice.customer_name,
        customer_email: invoice.customer_email,
        number: invoice.number
      }
    end
  end

  private def invoice_refunded?(invoice)
    return false unless invoice.charge

    charge = Stripe::Charge.retrieve(invoice.charge)
    charge.amount == charge.amount_refunded
  end

  private def linked_quill_subscription?(stripe_invoice_id) = Subscription.exists?(stripe_invoice_id:)

  # These conditions are ordered least to most expensive to compute
  private def relevant_stripe_invoice?(invoice)
    invoice.amount_due.positive? &&
    invoice.status.in?(RELEVANT_INVOICE_STATUSES) &&
    !linked_quill_subscription?(invoice.id) &&
    !invoice_refunded?(invoice) &&
    !charge_failed?(invoice)
  end

  private def relevant_stripe_invoices
    @relevant_stripe_invoices ||= [].tap do |invoices|
      Stripe::Invoice.list(created: { gte: INVOICE_START_EPOCH }, limit: 100).auto_paging_each do |invoice|
        invoices << invoice if relevant_stripe_invoice?(invoice)
      end
    end
  end
end
