class ErrorAnalytics
  attr_accessor :analytics

  def initialize(analyzer = SegmentAnalytics.new)
    self.analytics = analyzer
  end

  def track_500
    anonymous_id = SecureRandom.urlsafe_base64
    analytics.track({event: SegmentIo::Events::ERROR_500, anonymous_id: anonymous_id})
  end

end