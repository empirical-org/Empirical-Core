# frozen_string_literal: true

class AlertSoonToExpireSubscriptionsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  TEACHER_RENEW_IN_30 = SegmentIo::BackgroundEvents::TEACHER_SUB_WILL_RENEW_IN_30
  SCHOOL_RENEW_IN_30 = SegmentIo::BackgroundEvents::SCHOOL_SUB_WILL_RENEW_IN_30
  TEACHER_RENEW_IN_7 = SegmentIo::BackgroundEvents::TEACHER_SUB_WILL_RENEW_IN_7
  SCHOOL_RENEW_IN_7 = SegmentIo::BackgroundEvents::SCHOOL_SUB_WILL_RENEW_IN_7

  TEACHER_EXPIRE_IN_30 = SegmentIo::BackgroundEvents::TEACHER_SUB_WILL_EXPIRE_IN_30
  TEACHER_EXPIRE_IN_14 = SegmentIo::BackgroundEvents::TEACHER_SUB_WILL_EXPIRE_IN_14
  SCHOOL_EXPIRE_IN_30 = SegmentIo::BackgroundEvents::SCHOOL_SUB_WILL_EXPIRE_IN_30
  SCHOOL_EXPIRE_IN_14 = SegmentIo::BackgroundEvents::SCHOOL_SUB_WILL_EXPIRE_IN_14

  # Send a segment event for each credit card subscription that is expiring soon
  # to trigger specific reminder emails from Intercom
  # Events/emails differ on time, school/teacher, and whether auto-renew is on (renewing vs. expiring)
  def perform
    current_time = Time.current
    in_30_days = current_time + 30.days
    in_14_days = current_time + 14.days
    in_7_days = current_time + 7.days

    # renewing subscriptions (credit card only)
    track_teachers(renewing_subs.for_teachers.expiring(in_30_days), TEACHER_RENEW_IN_30)
    track_teachers(renewing_subs.for_teachers.expiring(in_7_days), TEACHER_RENEW_IN_7)
    track_schools(renewing_subs.for_schools.expiring(in_30_days), SCHOOL_RENEW_IN_30)
    track_schools(renewing_subs.for_schools.expiring(in_7_days), SCHOOL_RENEW_IN_7)

    # expiring subscriptions (credit card only)
    track_teachers(expiring_subs.for_teachers.expiring(in_30_days), TEACHER_EXPIRE_IN_30)
    track_teachers(expiring_subs.for_teachers.expiring(in_14_days), TEACHER_EXPIRE_IN_14)
    track_schools(expiring_subs.for_schools.expiring(in_30_days), SCHOOL_EXPIRE_IN_30)
    track_schools(expiring_subs.for_schools.expiring(in_14_days), SCHOOL_EXPIRE_IN_14)
  end

  private def renewing_subs
    Subscription.paid_with_card.recurring
  end

  private def expiring_subs
    Subscription.paid_with_card.not_recurring
  end

  private def analytics
    @analytics ||= SegmentAnalytics.new
  end

  private def track_teachers(finder, event)
    finder.each {|sub| analytics.track_teacher_subscription(sub, event) }
  end

  private def track_schools(finder, event)
    finder.each {|sub| analytics.track_school_subscription(sub, event) }
  end
end
