class ReferrerAnalytics
  attr_accessor :analytics

  def initialize
    self.analytics = SegmentAnalytics.new
  end

  def track_referral_invited(referrer, referral_id)
    analytics_identify(referrer)
    analytics_track(user_id: referrer.id,
                    event: SegmentIo::Events::REFERRAL_INVITED,
                    properties: { referral_id: referral_id })
  end

  def track_referral_activated(referrer, referral_id)
    analytics_identify(referrer)
    analytics_track(user_id: referrer.id,
                    event: SegmentIo::Events::REFERRAL_ACTIVATED,
                    properties: { referral_id: referral_id })
  end

  private

  def analytics_track(hash)
    analytics.track(hash)
  end

  def analytics_identify(user)
    analytics.identify(user)
  end
end
