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

  private def relevant_stripe_invoices
    stripe_invoices.reject do |invoice|
      invoice_ids_with_subscriptions.include?(invoice.id) || invoice_refunded?(invoice) || charge_failed?(invoice)
    end
  end

  private def invoice_ids_with_subscriptions
    @invoice_ids_with_subscriptions ||=
      Subscription
        .where(stripe_invoice_id: stripe_invoice_ids)
        .pluck(:stripe_invoice_id)
  end

  private def invoice_refunded?(invoice)
    return false unless invoice.charge

    charge = Stripe::Charge.retrieve(invoice.charge)
    charge.amount == charge.amount_refunded
  end

  private def stripe_invoice_ids = stripe_invoices.map(&:id)

  private def stripe_invoice_list_params
    {
      amount_due: { gt: 0 },
      created: { gte: INVOICE_START_EPOCH },
      limit: 100,
      status: RELEVANT_INVOICE_STATUSES
    }
  end

  private def stripe_invoices
    @stripe_invoices ||= [].tap do |invoices|
      Stripe::Invoice.list(**stripe_invoice_list_params).auto_paging_each { |invoice| invoices << invoice }
    end
  end
end
