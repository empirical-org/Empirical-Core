# frozen_string_literal: true

module StripeIntegration
  class Subscription < SimpleDelegator
    def last_four
      return nil if stripe_invoice_id.nil?

      stripe_payment_method&.card&.last4
    rescue Stripe::InvalidRequestError
      nil
    end

    def stripe_subscription_id
      return nil if stripe_invoice_id.nil?

      stripe_invoice.subscription
    rescue Stripe::InvalidRequestError
      nil
    end

    def stripe_customer_id
      return nil if stripe_invoice_id.nil?

      stripe_subscription.customer
    rescue Stripe::InvalidRequestError
      nil
    end

    private def stripe_customer
      Stripe::Customer.retrieve(stripe_customer_id)
    end

    private def stripe_invoice
      Stripe::Invoice.retrieve(stripe_invoice_id)
    end

    private def stripe_default_payment_method_id
      stripe_subscription.default_payment_method
    end

    private def stripe_payment_method
      Stripe::PaymentMethod.retrieve(stripe_default_payment_method_id)
    end

    private def stripe_subscription
      Stripe::Subscription.retrieve(stripe_subscription_id)
    end
  end
end
