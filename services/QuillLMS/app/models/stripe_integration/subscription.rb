# frozen_string_literal: true

module StripeIntegration
  class Subscription < SimpleDelegator
    def last_four
      return nil if stripe_invoice_id.nil?

      stripe_payment_method&.card&.last4
    rescue Stripe::InvalidRequestError
      nil
    end

    private def stripe_customer
      Stripe::Customer.retrieve(stripe_subscription.customer)
    end

    private def stripe_invoice
      Stripe::Invoice.retrieve(stripe_invoice_id)
    end

    # Initially, when purchasing a subscription, the Stripe::Subscription object is assigned default payment method.
    # If the credit card is subequently changed, then default payment method is removed from Stripe::Subscription and
    # added to Stripe::Customer.
    private def stripe_default_payment_method_id
      stripe_subscription.default_payment_method || stripe_customer.invoice_settings&.default_payment_method
    end

    private def stripe_payment_method
      Stripe::PaymentMethod.retrieve(stripe_default_payment_method_id)
    end

    private def stripe_subscription
      Stripe::Subscription.retrieve(stripe_invoice.subscription)
    end
  end
end
