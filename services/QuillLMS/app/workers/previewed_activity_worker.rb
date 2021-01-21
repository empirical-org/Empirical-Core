class PreviewedActivityWorker
  include Sidekiq::Worker

  def perform(user_id, activity_id)
    if user_id
      analytics = SegmentAnalytics.new
      analytics.track_previewed_activity(user_id, activity_id)
    end
  end
end
