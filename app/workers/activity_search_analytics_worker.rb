class ActivitySearchAnalyticsWorker
  include Sidekiq::Worker

  def perform(user_id, search_query)
    analytics = SegmentAnalytics.new
    analytics.track_activity_search(user_id, search_query)
  end
end
