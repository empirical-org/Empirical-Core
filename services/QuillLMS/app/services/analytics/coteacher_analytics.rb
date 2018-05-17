class CoteacherAnalytics
  attr_accessor :analytics

  def initialize
    self.analytics = SegmentAnalytics.new
  end

  def track_coteacher_invitation(teacher, invitee_email)
    analytics_identify(teacher)
    analytics_track(user_id: teacher.id,
                    event: SegmentIo::Events::COTEACHER_INVITATION,
                    properties: { invitee_email: invitee_email })
  end

  def track_transfer_classroom(teacher, new_owner_id)
    analytics_identify(teacher)
    analytics_track(user_id: teacher.id,
                    event: SegmentIo::Events::TRANSFER_OWNERSHIP,
                    properties: { new_owner_id: new_owner_id })
  end

  private

  def analytics_track(hash)
    analytics.track(hash)
  end

  def analytics_identify(user)
    analytics.identify(user)
  end
end
