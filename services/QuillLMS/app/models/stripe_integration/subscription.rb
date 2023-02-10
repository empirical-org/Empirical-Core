# frozen_string_literal: true

module StripeIntegration
  class Subscription < SimpleDelegator
    CANCELED = 'canceled'
    INCOMPLETE_EXPIRED = 'incomplete_expired'

    def stripe_cancel_at_period_end
      return if stripe_subscription_id.nil?
      return if stripe_invoice_id.nil?
      return if already_canceled_or_incomplete_expired?

      Stripe::Subscription.update(stripe_subscription_id, cancel_at_period_end: true)
    end

    def last_four
      return nil if stripe_invoice_id.nil?

      stripe_card&.last4
    rescue Stripe::InvalidRequestError
      nil
    end

    def stripe_subscription_url
      "#{STRIPE_DASHBOARD_URL}/subscriptions/#{stripe_subscription_id}"
    end

    private def already_canceled_or_incomplete_expired?
      stripe_subscription.respond_to?(:status) && stripe_subscription.status.in?([CANCELED, INCOMPLETE_EXPIRED])
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

    private def stripe_subscription
      Stripe::Subscription.retrieve(stripe_subscription_id)
    end

    private def stripe_payment_method
      Stripe::PaymentMethod.retrieve(stripe_payment_method_id)&.card
    rescue Stripe::InvalidRequestError
      nil
    end

    private def stripe_payment_method_id
      stripe_subscription.default_payment_method || stripe_customer.invoice_settings.default_payment_method
    end

    private def stripe_default_source
      stripe_customer&.default_source
    end

    private def stripe_source
      return nil if stripe_default_source.nil?

      Stripe::Customer.retrieve_source(stripe_customer_id, stripe_default_source)
    rescue Stripe::InvalidRequestError
      nil
    end

    private def stripe_subscription
      Stripe::Subscription.retrieve(stripe_subscription_id)
    end
  end
end
