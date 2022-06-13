# frozen_string_literal: true

class PreviewedActivityWorker
  include Sidekiq::Worker

  def perform(user_id, activity_id)
    return unless user_id

    analytics = SegmentAnalytics.new
    analytics.track_previewed_activity(user_id, activity_id)
  end
end
