# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class SubscriptionCreator < ApplicationService
      class Error < StandardError; end
      class AmountPaidMismatchError < Error; end
      class DuplicateSubscriptionError < Error; end
      class NilSchoolError < Error; end
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
        raise DuplicateSubscriptionError if duplicate_subscription?
        raise AmountPaidMismatchError if payment_amount != plan.price

        subscription
        save_stripe_customer_id
        run_plan_custom_tasks
      end

      private def duplicate_subscription?
        case plan
        when Plan.stripe_teacher_plan
          purchaser.subscription&.plan == plan
        when Plan.stripe_school_plan
          purchaser.associated_schools.any? do |school|
            school.subscriptions.active.any?  do |subscription|
              subscription.schools.pluck(:id).sort == school_ids
            end
          end
        end
      end

      private def expiration
        Time.at(stripe_subscription.current_period_end).to_date
      end

      private def payment_amount
        stripe_invoice.amount_paid
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
        case plan
        when Plan.stripe_teacher_plan
          UserSubscription.create!(user: purchaser, subscription: subscription)
          UpdateSalesContactWorker.perform_async(purchaser.id, SalesStageType::TEACHER_PREMIUM)
        when Plan.stripe_school_plan
          schools = School.where(id: school_ids)
          raise NilSchoolError if schools.empty?

          schools.each { |school| subscription.school_subscriptions.create!(school: school) }
          UpdateSalesContactWorker.perform_async(purchaser.id, SalesStageType::SCHOOL_PREMIUM)
        end
      end

      private def save_stripe_customer_id
        raise NilStripeCustomerIdError if stripe_customer_id.nil?

        purchaser.update!(stripe_customer_id: stripe_customer_id)
      end

      private def school_ids
        return [] if stripe_subscription.metadata[:school_ids].nil?

        JSON.parse(stripe_subscription.metadata[:school_ids]).sort
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
          payment_amount: payment_amount,
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
    end
  end
end
