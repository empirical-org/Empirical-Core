# frozen_string_literal: true

module StripeIntegration
  class SubscriptionCheckoutSessionsController < ApplicationController
    SUBSCRIPTION_MODE = 'subscription'

    def create
      subscription_checkout_session = Stripe::Checkout::Session.create(subscription_checkout_session_args)
      render json: { redirect_url: subscription_checkout_session.url }
    end

    private def subscription_checkout_session_args
      {
        cancel_url: cancel_url,
        line_items: [{
          price: stripe_price_id,
          quantity: 1
        }],
        mode: SUBSCRIPTION_MODE,
        subscription_data: subscription_data,
        success_url: success_url
      }.merge(customer_arg)
    end

    private def customer_arg
      stripe_customer_id.nil? ? { customer_email: customer_email } : { customer: stripe_customer_id }
    end

    private def cancel_path
      params[:cancel_path]
    end

    private def cancel_url
      "#{ENV['DEFAULT_URL']}/#{cancel_path}"
    end

    private def customer_email
      params[:customer_email]
    end

    private def school_ids
      params[:school_id]
    end

    private def stripe_price_id
      params[:stripe_price_id]
    end

    private def stripe_customer_id
      User.find_by(email: customer_email).stripe_customer_id
    end

    private def success_url
      "#{subscriptions_url}?checkout_session_id={CHECKOUT_SESSION_ID}"
    end

    private def subscription_data
      return {} unless School.exists?(id: school_ids)

      { metadata: { school_ids: school_ids } }
    end
  end
end

