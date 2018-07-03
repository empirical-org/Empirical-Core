class Analyzer
  attr_accessor :analytics

  def initialize(analyzer = SegmentAnalytics.new)
    @analytics = analyzer
  end

  def track(user, event)
    analytics_identify(user)
    analytics_track(user_id: user.id,
      event: event,
      context: { ip: user.ip_address }
    )
  end

  def track_with_attributes(user, event, attributes)
    analytics_identify(user)
    analytics_track({user_id: user.id, event: event}.merge(attributes))
  end

  private

  def analytics_track(hash)
    analytics.track(hash)
  end

  def analytics_identify(user)
    analytics.identify(user)
  end
end