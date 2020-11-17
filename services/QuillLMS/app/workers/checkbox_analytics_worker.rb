class CheckboxAnalyticsWorker
  include Sidekiq::Worker

  def perform(user_id, activity_id)
    analytics = SegmentAnalytics.new
    analytics.track_activity_assignment(user_id, activity_id)
  end

end
