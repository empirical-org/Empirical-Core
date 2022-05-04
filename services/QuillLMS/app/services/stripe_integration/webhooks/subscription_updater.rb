# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class SubscriptionUpdater < ApplicationService
      class SubscriptionNotFoundError < StandardError; end
      class NilCancelAtPeriodEndError < StandardError; end

      INCOMPLETE = 'incomplete'

      attr_reader :stripe_subscription, :previous_attributes

      def initialize(stripe_subscription, previous_attributes)
        @stripe_subscription = stripe_subscription
        @previous_attributes = previous_attributes
      end

      def run
        return if previously_incomplete?

        subscription.update!(recurring: recurring)
      end

      private def cancel_at_period_end
        stripe_subscription.cancel_at_period_end
      end

      private def previously_incomplete?
        previous_attributes&.status == INCOMPLETE
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
