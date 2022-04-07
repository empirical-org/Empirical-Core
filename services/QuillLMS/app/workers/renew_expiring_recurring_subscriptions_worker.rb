# frozen_string_literal: true

class RenewExpiringRecurringSubscriptionsWorker
  include Sidekiq::Worker

  def perform
    Subscription.update_todays_expired_recurring_subscriptions
  end
end
