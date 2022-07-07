# frozen_string_literal: true

module Subscriber
  extend ActiveSupport::Concern

  def ever_paid_for_subscription?
    (Subscription::OFFICIAL_PAID_TYPES & subscriptions.pluck(:account_type)).present?
  end

  def last_expired_subscription
    subscriptions
      .expired
      .order(expiration: :desc)
      .first
  end

  def present_and_future_subscriptions
    subscriptions.active
  end

  def promotional_dates?
    is_a?(School)|| is_a?(District)
  end

  def subscription
    subscriptions
      .started
      .not_expired
      .not_de_activated
      .order(expiration: :desc)
      .first
  end

  def subscription_status
    subscription&.subscription_status || last_expired_subscription&.subscription_status
  end
end
