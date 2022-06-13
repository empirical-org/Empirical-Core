# frozen_string_literal: true

module StripeIntegration
  class SubscriptionRenewalsController < ApplicationController
    class UpdatingCanceledSubscriptionError < StandardError; end

    def create
      raise UpdatingCanceledSubscriptionError if stripe_subscription_canceled?

      Stripe::Subscription.update(stripe_subscription_id, cancel_at_period_end: cancel_at_period_end)
      render json: {}, status: 200
    rescue UpdatingCanceledSubscriptionError, Stripe::InvalidRequestError => e
      ErrorNotifier.report(e, stripe_subscription_id: stripe_subscription_id)
      render json: {}, status: 500
    end

    private def cancel_at_period_end
      params[:cancel_at_period_end]
    end

    private def stripe_subscription_id
      params[:stripe_subscription_id]
    end

    private def stripe_subscription_canceled?
      Stripe::Subscription.retrieve(stripe_subscription_id).canceled_at.present?
    end
  end
end
