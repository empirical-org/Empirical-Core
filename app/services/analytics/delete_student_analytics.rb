class DeleteStudentAnalytics
  attr_accessor :analytics

  def initialize
    self.analytics = SegmentAnalytics.new
  end

  def track(teacher, referred_from_class_path)
    track_for_teacher(teacher)
  end

  private

  def track_for_teacher teacher, referred_from_class_path
    analytics_identify(teacher)
    if referred_from_class_path
      analytics_track({
        user_id: teacher.id,
        event: SegmentIo::Events::TEACHER_DELETED_STUDENT_ACCOUNT,
        context: {:ip => teacher.ip_address }
      })
    else
      analytics_track({
        user_id: teacher.id,
        event: SegmentIo::Events::MYSTERY_STUDENT_DELETION,
        context: {:ip => teacher.ip_address }
      })
    end
  end

  def analytics_track hash
    analytics.track(hash)
  end

  def analytics_identify user
    analytics.identify(user)
  end

end
