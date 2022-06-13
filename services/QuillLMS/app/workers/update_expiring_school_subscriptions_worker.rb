# frozen_string_literal: true

class UpdateExpiringSchoolSubscriptionsWorker
  include Sidekiq::Worker

  def perform
    Subscription.update_todays_expired_school_subscriptions
  end
end
