class ErrorAnalytics
  attr_accessor :analytics

  def initialize
    self.analytics = SegmentAnalytics.new
  end

  def track_500
    analytics.track({event: SegmentIo::Events::ERROR_500})
  end

end