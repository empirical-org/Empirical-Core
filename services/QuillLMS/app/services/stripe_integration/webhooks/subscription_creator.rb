# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class SubscriptionCreator < ApplicationService
      class Error < StandardError; end
      class DuplicateSubscriptionError < Error; end
      class NilStripeSubscriptionIdError < Error; end
      class PlanNotFoundError < Error; end
      class PurchaserNotFoundError < Error; end

      attr_reader :purchaser_email, :stripe_customer_id, :stripe_subscription_id

      def initialize(data)
        @purchaser_email = data[:customer_email]
        @stripe_customer_id = data[:customer]
        @stripe_subscription_id = data[:subscription]
      end

      def run
        raise NilStripeSubscriptionIdError if stripe_subscription_id.nil?
        raise DuplicateSubscriptionError if Subscription.exists?(stripe_subscription_id: stripe_subscription_id)

        subscription
        update_stripe_customer_id
        run_plan_custom_tasks
      end

      private def expiration
        Time.at(stripe_subscription.current_period_end).to_date
      end

      private def plan
        @plan ||= Plan.find_by!(stripe_price_id: stripe_price_id)
      rescue ActiveRecord::RecordNotFound
        raise PlanNotFoundError
      end

      private def purchaser
        @purchaser ||= User.find_by!(email: purchaser_email)
      rescue ActiveRecord::RecordNotFound
        raise PurchaserNotFoundError
      end

      private def run_plan_custom_tasks
        return unless plan.teacher?

        UserSubscription.create!(user: purchaser, subscription: subscription)
        UpdateSalesContactWorker.perform_async(purchaser.id, SalesStageType::TEACHER_PREMIUM)
      end

      private def start_date
        Time.at(stripe_subscription.current_period_start).to_date
      end

      private def stripe_price_id
        stripe_subscription&.items&.data&.first&.price&.id
      end

      private def stripe_subscription
        @stripe_subscription ||= Stripe::Subscription.retrieve(stripe_subscription_id)
      end

      private def subscription
        @subscription ||= Subscription.create!(
          expiration: expiration,
          plan: plan,
          purchaser: purchaser,
          recurring: true,
          start_date: start_date,
          stripe_subscription_id: stripe_subscription_id
        )
      end

      private def update_stripe_customer_id
        purchaser.update!(stripe_customer_id: stripe_customer_id) unless stripe_customer_id.nil?
      end
    end
  end
end


