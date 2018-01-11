class FinishActivityAnalytics
  attr_accessor :analytics

  def initialize
    self.analytics = SegmentAnalytics.new
  end

  def track(activity_session)
    return if activity_session.classroom_activity.nil?
    return if activity_session.classroom_activity.classroom.nil?
    teacher = activity_session.classroom_activity.classroom.owner
    return if teacher.nil?

    analytics_identify(teacher)
    analytics_track({

      user_id: teacher.id,

      event: SegmentIo::Events::ACTIVITY_COMPLETION,

      context: {:ip => teacher.ip_address }
    })
  end


  private

  def analytics_track hash
    analytics.track(hash)
  end

  def analytics_identify user
    analytics.identify(user)
  end

end
