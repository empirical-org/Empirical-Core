# frozen_string_literal: true

module StripeIntegration
  class User < SimpleDelegator
    def last_four
      return nil unless stripe_customer_id

      stripe_default_payment_method&.card&.last4 || stripe_customer_source&.last4
    end

    private def stripe_customer
      Stripe::Customer.retrieve(id: stripe_customer_id, expand: ['sources'])
    rescue Stripe::InvalidRequestError
      nil
    end

    private def stripe_customer_source
      stripe_customer&.sources&.data&.first
    end

    private def stripe_default_payment_method
      Stripe::PaymentMethod.retrieve(stripe_default_payment_method_id)
    rescue Stripe::InvalidRequestError
      nil
    end

    private def stripe_default_payment_method_id
      stripe_customer&.invoice_settings&.default_payment_method
    end
  end
end
