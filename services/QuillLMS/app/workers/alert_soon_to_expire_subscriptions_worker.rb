# frozen_string_literal: true

class AlertSoonToExpireSubscriptionsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform
    current_time = Time.current

    subs_expiring_in_thirty = Subscription.paid_with_card.where(expiration: current_time + 30.days)
    teacher_subs_renewing_in_thirty = subs_expiring_in_thirty.where(account_type: Subscription::OFFICIAL_TEACHER_TYPES, recurring: true)
    school_subs_renewing_in_thirty = subs_expiring_in_thirty.where(account_type: Subscription::OFFICIAL_SCHOOL_TYPES, recurring: true)
    teacher_subs_expiring_in_thirty = subs_expiring_in_thirty.where(account_type: Subscription::OFFICIAL_TEACHER_TYPES, recurring: false)
    school_subs_expiring_in_thirty = subs_expiring_in_thirty.where(account_type: Subscription::OFFICIAL_SCHOOL_TYPES, recurring: false)
    teacher_subs_expiring_in_fourteen = Subscription.paid_with_card.where(account_type: Subscription::OFFICIAL_TEACHER_TYPES, expiration: current_time + 14.days, recurring: false)
    school_subs_expiring_in_fourteen = Subscription.paid_with_card.where(account_type: Subscription::OFFICIAL_SCHOOL_TYPES, expiration: current_time + 14.days, recurring: false)

    analytics = SegmentAnalytics.new
    teacher_subs_renewing_in_thirty.each { |sub| analytics.track_teacher_subscription(sub, SegmentIo::BackgroundEvents::TEACHER_SUB_WILL_RENEW_IN_30) }
    school_subs_renewing_in_thirty.each { |sub| analytics.track_school_subscription(sub, SegmentIo::BackgroundEvents::SCHOOL_SUB_WILL_RENEW_IN_30) }
    teacher_subs_expiring_in_thirty.each { |sub| analytics.track_teacher_subscription(sub, SegmentIo::BackgroundEvents::TEACHER_SUB_WILL_EXPIRE_IN_30) }
    school_subs_expiring_in_thirty.each { |sub| analytics.track_school_subscription(sub, SegmentIo::BackgroundEvents::SCHOOL_SUB_WILL_EXPIRE_IN_30) }
    teacher_subs_expiring_in_fourteen.each { |sub| analytics.track_teacher_subscription(sub, SegmentIo::BackgroundEvents::TEACHER_SUB_WILL_EXPIRE_IN_14) }
    school_subs_expiring_in_fourteen.each { |sub| analytics.track_school_subscription(sub, SegmentIo::BackgroundEvents::SCHOOL_SUB_WILL_EXPIRE_IN_14) }
  end
end
