class AccountCreationAnalytics
  attr_accessor :analytics

  def initialize
    self.analytics = SegmentAnalytics.new
  end

  def track_teacher(teacher)
    analytics_identify(teacher)
    basic_track_teacher(teacher)
    track_teacher_newsletter(teacher)
  end

  def track_student(student)
    analytics_identify(student)
    analytics_track({
      user_id: student.id,
      event: SegmentIo::Events::STUDENT_ACCOUNT_CREATION,
      context: {:ip => student.ip_address },
      integrations: { intercom: 'false' }
    })
  end

  private

  def basic_track_teacher(teacher)
    analytics_track({
      user_id: teacher.id,
      event: SegmentIo::Events::TEACHER_ACCOUNT_CREATION,
      context: {:ip => teacher.ip_address }
    })
  end

  def track_teacher_newsletter(teacher)
    return if not teacher.send_newsletter
    analytics_track({
      user_id: teacher.id,
      event: SegmentIo::Events::TEACHER_SIGNED_UP_FOR_NEWSLETTER,
      context: {:ip => teacher.ip_address }
    })
  end

  def analytics_track(hash)
    analytics.track hash
  end

  def analytics_identify(user)
    analytics.identify user
  end
end
