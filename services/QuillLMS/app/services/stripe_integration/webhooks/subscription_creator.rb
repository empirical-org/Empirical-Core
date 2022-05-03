# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class SubscriptionCreator < ApplicationService
      class Error < StandardError; end
      class NilStripeCustomerIdError < Error; end
      class NilStripeInvoiceIdError < Error; end
      class NilStripePriceIdError < Error; end
      class PlanNotFoundError < Error; end
      class PurchaserNotFoundError < Error; end
      class StripeInvoiceIdNotUniqueError < Error; end

      attr_reader :stripe_invoice, :stripe_subscription

      def initialize(stripe_invoice, stripe_subscription)
        @stripe_invoice = stripe_invoice
        @stripe_subscription = stripe_subscription
      end

      def run
        raise NilPurchaserEmailError if purchaser_email.nil?
        raise NilStripePriceIdError if stripe_price_id.nil?
        raise NilStripeInvoiceIdError if stripe_invoice.id.nil?

        subscription
        save_stripe_customer_id
        run_plan_custom_tasks
      end

      private def expiration
        Time.at(stripe_subscription.current_period_end).to_date
      end

      private def plan
        @plan ||= Plan.find_stripe_plan!(stripe_price_id)
      rescue ActiveRecord::RecordNotFound
        raise PlanNotFoundError
      end

      private def purchaser
        @purchaser ||= User.find_by!(email: purchaser_email)
      rescue ActiveRecord::RecordNotFound
        raise PurchaserNotFoundError
      end


      private def purchaser_email
        stripe_invoice.customer_email
      end

      private def run_plan_custom_tasks
        return unless plan.teacher?

        UserSubscription.create!(user: purchaser, subscription: subscription)
        UpdateSalesContactWorker.perform_async(purchaser.id, SalesStageType::TEACHER_PREMIUM)
      end

      private def start_date
        Time.at(stripe_subscription.current_period_start).to_date
      end

      private def stripe_customer_id
        stripe_subscription.customer
      end

      private def stripe_price_id
        stripe_subscription&.items&.data&.first&.price&.id
      end

      private def subscription
        @subscription ||= ::Subscription.create!(
          account_type: plan.name,
          expiration: expiration,
          payment_amount: plan.price,
          payment_method: ::Subscription::CREDIT_CARD_PAYMENT_METHOD,
          plan: plan,
          purchaser_email: purchaser_email,
          recurring: true,
          start_date: start_date,
          stripe_invoice_id: stripe_invoice.id
        )
      rescue ActiveRecord::RecordNotUnique
        raise StripeInvoiceIdNotUniqueError
      end

      private def save_stripe_customer_id
        raise NilStripeCustomerIdError if stripe_customer_id.nil?

        purchaser.update!(stripe_customer_id: stripe_customer_id)
      end
    end
  end
end
