class Analyzer
  attr_accessor :analytics

  def initialize(analyzer = SegmentAnalytics.new)
    @analytics = analyzer
  end

  def track(user, event)
    analytics.identify(user)
    analytics.track({user_id: user.id,
      event: event,
      context: { ip: user.ip_address } }
    )
  end

  def track_with_attributes(user, event, attributes)
    analytics.identify(user)
    analytics.track({user_id: user.id, event: event}.merge(attributes))
  end

  def track_chain(user, events)
    analytics.identify(user)
    events.each do |event|
      analytics.track({
        user_id: user.id,
        event: event,
        context: { ip: user.ip_address }
      })
    end
  end
end
