class ReferrerAnalytics
  attr_accessor :analytics

  def initialize
    self.analytics = SegmentAnalytics.new
  end

  def track_referral_invited(referrer, referral_id)
    analytics_identify(referrer)
    analytics_track(referrer, {
                      user_id: referrer.id,
                      event: SegmentIo::BackgroundEvents::REFERRAL_INVITED,
                      properties: { referral_id: referral_id }
    })
  end

  def track_referral_activated(referrer, referral_id)
    analytics_identify(referrer)
    analytics_track(referrer, {
                      user_id: referrer.id,
                      event: SegmentIo::BackgroundEvents::REFERRAL_ACTIVATED,
                      properties: { referral_id: referral_id }
    })
  end

  private

  def analytics_track(user, hash)
    analytics.track(user, hash)
  end

  def analytics_identify(user)
    analytics.identify(user)
  end
end
