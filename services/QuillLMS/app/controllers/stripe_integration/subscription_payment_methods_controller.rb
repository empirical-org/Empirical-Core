# frozen_string_literal: true

module StripeIntegration
  class SubscriptionPaymentMethodsController < ApplicationController
    PAYMENT_METHOD_TYPES = ['card'].freeze
    SETUP_MODE = 'setup'

    def create
      payment_method_session = Stripe::Checkout::Session.create(payment_method_session_args)
      render json: { redirect_url: payment_method_session.url }
    end

    private def payment_method_session_args
      {
        payment_method_types: PAYMENT_METHOD_TYPES,
        mode: SETUP_MODE,
        customer: customer,
        setup_intent_data: {
          metadata: {
            subscription_id: subscription_id,
          },
        },
        success_url: success_url,
        cancel_url: subscriptions_url
      }
    end

    private def customer
      params[:stripe_customer_id]
    end

    private def subscription_id
      params[:stripe_subscription_id]
    end

    private def success_url
      subscriptions_url(stripe_payment_method_updated: true)
    end
  end
end
