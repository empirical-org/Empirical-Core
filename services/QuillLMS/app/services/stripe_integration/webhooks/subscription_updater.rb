# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class SubscriptionUpdater < ApplicationService
      class SubscriptionNotFoundError < StandardError; end
      class NilCancelAtPeriodEndError < StandardError; end

      attr_reader :stripe_subscription

      def initialize(stripe_subscription)
        @stripe_subscription = stripe_subscription
      end

      def run
        subscription.update!(recurring: recurring)
      end

      private def cancel_at_period_end
        stripe_subscription.cancel_at_period_end
      end

      private def recurring
        raise NilCancelAtPeriodEndError if cancel_at_period_end.nil?

        !cancel_at_period_end
      end

      private def stripe_invoice_id
        stripe_subscription.latest_invoice
      end

      private def subscription
        ::Subscription.find_by!(stripe_invoice_id: stripe_invoice_id)
      rescue ActiveRecord::RecordNotFound
        raise SubscriptionNotFoundError
      end
    end
  end
end
