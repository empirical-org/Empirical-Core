class CheckboxAnalyticsWorker
  include Sidekiq::Worker

  def perform(user_id, name)
    user = User.find_by(id: user_id)
    analytics = SegmentAnalytics.new
    if report_to_segment?(name)
      analytics.track_event_from_string(SegmentIo::BackgroundEvents::ACTIVITY_ASSIGNMENT, user_id)
    end
  end

  def report_to_segment? name
    ['Assign Featured Activity Pack',
     'Build Your Own Activity Pack'].include?(name)
  end

end
