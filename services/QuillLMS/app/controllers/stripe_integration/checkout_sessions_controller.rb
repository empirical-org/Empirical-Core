# frozen_string_literal: true

module StripeIntegration
  class CheckoutSessionsController < ApplicationController
    SUBSCRIPTION_MODE = 'subscription'

    def create
      checkout_session =
        Stripe::Checkout::Session.create(
          success_url: success_url,
          cancel_url: cancel_url,
          customer: stripe_customer_id,
          customer_email: customer_email,
          mode: SUBSCRIPTION_MODE,
          line_items: [{
            quantity: 1,
            price: price_id
          }]
        )

      render json: { redirect_url: checkout_session.url }
    end

    private def cancel_url
      "#{ENV['DEFAULT_URL']}/premium"
    end

    private def customer_email
      params[:customer_email]
    end

    private def price_id
      params[:price_id]
    end

    private def stripe_customer_id
      params[:stripe_customer_id]
    end

    private def success_url
      "#{ENV['DEFAULT_URL']}/subscriptions?stripe_payment_success=true"
    end
  end
end

