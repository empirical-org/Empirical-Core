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

    private def customer
      User.find_by_stripe_customer_id_or_email(stripe_customer_id, customer_email)
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

    private def schools
      @schools ||= School.where(id: school_ids)
    end

    private def school_ids
      return [] if params[:school_ids].nil?

      JSON.parse(params[:school_ids])
    end

    private def school_plan?
      stripe_price_id == STRIPE_SCHOOL_PLAN_PRICE_ID
    end

    private def stripe_price_id
      params[:stripe_price_id]
    end

    private def stripe_customer_id
      User.find_by(email: customer_email).stripe_customer_id
    end

    private def success_url
      if schools.empty? || !customer.admin?
        "#{subscriptions_url}?checkout_session_id={CHECKOUT_SESSION_ID}"
      else
        "#{teacher_admin_subscriptions_url(school_id: school_ids.first)}&checkout_session_id={CHECKOUT_SESSION_ID}"
      end
    end

    private def subscription_data
      return {} if schools.empty?

      { metadata: { school_ids: school_ids.to_json } }
    end

    private def teacher_plan?
      stripe_price_id == STRIPE_TEACHER_PLAN_PRICE_ID
    end

    private def trial_period_days_arg
      return {} unless school_plan?

      trial_period_days = BonusDaysCalculator.run(customer)

      return {} if trial_period_days.zero?

      { trial_period_days: trial_period_days }
    end
  end
end
