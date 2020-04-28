class ErrorAnalytics
  attr_accessor :analytics

  def initialize(analyzer = SegmentAnalytics.new)
    self.analytics = analyzer
  end

  def track_500
    anonymous_id = SecureRandom.urlsafe_base64
    user = nil
    analytics.track(user, {event: SegmentIo::BackgroundEvents::ERROR_500, anonymous_id: anonymous_id})
  end

end
