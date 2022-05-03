# frozen_string_literal: true

module StripeIntegration
  class Subscription < SimpleDelegator
    def last_four
      return nil if stripe_invoice_id.nil?

      stripe_card&.last4
    rescue Stripe::InvalidRequestError
      nil
    end

    def stripe_subscription_id
      return nil if stripe_invoice_id.nil?

      stripe_invoice.subscription
    end

    private def stripe_card
      stripe_payment_method || stripe_source
    end

    private def stripe_customer
      Stripe::Customer.retrieve(stripe_customer_id)
    rescue Stripe::InvalidRequestError
      nil
    end

    private def stripe_customer_id
      stripe_subscription.customer
    end

    private def stripe_invoice
      Stripe::Invoice.retrieve(stripe_invoice_id)
    end

    private def stripe_payment_method
      Stripe::PaymentMethod.retrieve(stripe_payment_method_id)&.card
    rescue Stripe::InvalidRequestError
      nil
    end

    private def stripe_payment_method_id
      stripe_subscription.default_payment_method || stripe_customer.invoice_settings.default_payment_method
    end

    private def stripe_source
      Stripe::Customer.retrieve_source(stripe_customer_id, stripe_customer&.default_source)
    rescue Stripe::InvalidRequestError
      nil
    end

    private def stripe_subscription
      Stripe::Subscription.retrieve(stripe_subscription_id)
    end
  end
end
