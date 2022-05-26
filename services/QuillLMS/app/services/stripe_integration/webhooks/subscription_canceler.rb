# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class SubscriptionCanceler < ApplicationService
      class NilCanceledAtError < StandardError; end
      class SubscriptionNotFoundError < StandardError; end

      attr_reader :stripe_subscription

      def initialize(stripe_subscription)
        @stripe_subscription = stripe_subscription
      end

      def run
        raise NilCanceledAtError if canceled_at.nil?

        subscription.update!(recurring: false, expiration: expiration)
      end

      private def canceled_at
        stripe_subscription.canceled_at
      end

      private def expiration
        Time.at(canceled_at).utc.to_date
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
