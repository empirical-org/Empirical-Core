# frozen_string_literal: true

class IdentifyStripeInvoicesWithoutSubscriptionsWorker
  include Sidekiq::Worker

  # We don't care about invoices created before we began using this workflow
  INVOICE_START_EPOCH = DateTime.new(2023,1,1).to_i
  RELEVANT_INVOICE_STATUSES = ['open', 'paid']

  def perform
    invoice_payloads = map_invoices_for_template(relevant_stripe_invoices)

    StripeIntegration::Mailer.invoices_without_subscriptions(invoice_payloads).deliver_now!
  end

  private def map_invoices_for_template(invoices)
    invoices.map do |invoice|
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
    stripe_invoices.filter do |invoice|
      RELEVANT_INVOICE_STATUSES.include?(invoice.status) &&
        !invoice_ids_with_subscriptions.include?(invoice.id) &&
        !invoice_refunded?(invoice) &&
        non_zero_amount?(invoice)
    end
  end

  private def invoice_ids_with_subscriptions
    @invoice_ids_with_subscrirptions ||= Subscription.where(stripe_invoice_id: stripe_invoice_ids).pluck(:stripe_invoice_id)
  end

  private def invoice_refunded?(invoice)
    return false unless invoice.charge

    charge = Stripe::Charge.retrieve(invoice.charge)
    charge.amount == charge.amount_refunded
  end

  private def non_zero_amount?(invoice)
    invoice.amount_due > 0
  end

  private def stripe_invoice_ids
    stripe_invoices.map(&:id)
  end

  private def stripe_invoices
    @stripe_invoices ||= [].tap do |stripe_invoices|
      Stripe::Invoice.list({limit: 100, created: {gte: INVOICE_START_EPOCH}}).auto_paging_each do |invoice|
        stripe_invoices.append(invoice)
      end
    end
  end
end
