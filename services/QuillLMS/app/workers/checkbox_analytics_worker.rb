# frozen_string_literal: true

class CheckboxAnalyticsWorker
  include Sidekiq::Worker

  def perform(user_id, activity_id)
    return unless User.exists?(id: user_id)

    SegmentAnalytics
      .new
      .track_activity_assignment(user_id, activity_id)
  end
end
