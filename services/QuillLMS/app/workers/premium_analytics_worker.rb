# frozen_string_literal: true

class PremiumAnalyticsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform(id, account_type)
    @user = User.find_by_id(id)
    return unless @user

    analytics = Analyzer.new
    if Subscription::OFFICIAL_FREE_TYPES.include?(account_type)
      event = SegmentIo::BackgroundEvents::BEGAN_PREMIUM_TRIAL
    elsif Subscription::OFFICIAL_SCHOOL_TYPES.include?(account_type)
      event = SegmentIo::BackgroundEvents::BEGAN_SCHOOL_PREMIUM
    else
      event = SegmentIo::BackgroundEvents::BEGAN_TEACHER_PREMIUM
    end
    # tell segment.io
    analytics.track(@user, event)
  end
end
