class DeleteStudentAnalytics
  attr_accessor :analytics

  def initialize
    self.analytics = SegmentAnalytics.new
  end

  def track(teacher)
    track_for_teacher(teacher)
  end

  private

  def track_for_teacher(teacher)
    analytics_identify(teacher)
      analytics_track({
        user_id: teacher.id,
        event: SegmentIo::Events::TEACHER_DELETED_STUDENT_ACCOUNT,
        context: {:ip => teacher.ip_address }
      })
  end

  def analytics_track hash
    analytics.track(hash)
  end

  def analytics_identify user
    analytics.identify(user)
  end

end
