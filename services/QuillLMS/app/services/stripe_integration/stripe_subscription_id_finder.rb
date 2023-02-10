# frozen_string_literal: true

module StripeIntegration
  class StripeSubscriptionIdFinder < ApplicationService
    attr_reader :checkout_session_id

    def initialize(checkout_session_id)
      @checkout_session_id = checkout_session_id
    end

    def run
      return nil if checkout_session_id.nil?

      stripe_subscription.id
    rescue Stripe::InvalidRequestError
      nil
    end

    private def stripe_checkout_session
      Stripe::Checkout::Session.retrieve(checkout_session_id)
    end

    private def stripe_subscription
      Stripe::Subscription.retrieve(stripe_checkout_session.subscription)
    end
  end
end
