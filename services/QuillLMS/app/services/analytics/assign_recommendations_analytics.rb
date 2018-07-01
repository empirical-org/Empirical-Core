class AssignRecommendationsAnalytics
  attr_accessor :analytics

  def initialize(analyzer = SegmentAnalytics.new)
    self.analytics = analyzer
  end

  def track(teacher)
    analytics_identify(teacher)
    analytics_track(user_id: teacher.id,
                    event: SegmentIo::Events::ASSIGN_RECOMMENDATIONS,
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
