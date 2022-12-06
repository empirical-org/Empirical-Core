# frozen_string_literal: true

class PremiumAnalyticsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform(id, account_type)
    @user = User.find_by_id(id)
    return unless @user

    analytics = Analyzer.new
    analytics.track_with_attributes(
      @user,
      SegmentIo::BackgroundEvents::TEACHER_BEGAN_PREMIUM,
      properties: @user.segment_user.premium_params
    )
  end
end
