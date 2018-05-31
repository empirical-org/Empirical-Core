class AccessProgressReportAnalytics
  attr_accessor :analytics

  def initialize
    self.analytics = SegmentAnalytics.new
  end

  def track(teacher)
    analytics_identify(teacher)
    analytics_track(user_id: teacher.id,
                    event: SegmentIo::Events::ACCESS_PROGRESS_REPORT,
                    context: { ip: teacher.ip_address })
  end

  private

  def analytics_track(hash)
    analytics.track(hash)
  end

  def analytics_identify(user)
    analytics.identify(user)
  end
end
