# frozen_string_literal: true

class AlertSoonToExpireSubscriptionsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform
    current_time = Time.current

    expiring_teacher_subs = Subscription.where(account_type: Subscription::OFFICIAL_TEACHER_TYPES, expiration: current_time + 30.days)
    expiring_school_subs = Subscription.where(account_type: Subscription::OFFICIAL_SCHOOL_TYPES, expiration: current_time + 30.days)

    analytics = SegmentAnalytics.new
    expiring_teacher_subs.each { |sub| analytics.trigger_teacher_subscription_will_expire(sub.id) }
    expiring_school_subs.each { |sub| analytics.trigger_school_subscription_will_expire(sub.id) }
  end
end
