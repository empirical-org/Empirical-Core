# frozen_string_literal: true

module StripeIntegration
  class BillingPortalSessionsController < ApplicationController
    def create
      billing_portal_session = Stripe::BillingPortal::Session.create(billing_portal_args)
      render json: { redirect_url: billing_portal_session.url }
    end

    private def billing_portal_args
      { customer: customer, return_url: return_url }
    end

    private def customer
      params[:stripe_customer_id]
    end

    private def return_url
      subscriptions_url
    end
  end
end
