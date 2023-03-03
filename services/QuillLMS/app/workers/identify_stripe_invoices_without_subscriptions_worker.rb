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
        !Subscription.exists?(stripe_invoice_id: invoice.id)
    end
  end

  private def stripe_invoices
    [].tap do |stripe_invoices|
      Stripe::Invoice.list({limit: 100, created: {gte: INVOICE_START_EPOCH}}).auto_paging_each do |invoice|
        stripe_invoices.append(invoice) if RELEVANT_INVOICE_STATUSES.include?(invoice.status) && !Subscription.exists?(stripe_invoice_id: invoice.id)
      end
    end
  end
end
