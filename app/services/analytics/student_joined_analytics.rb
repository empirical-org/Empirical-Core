class StudentJoinedAnalytics
  attr_accessor :analytics

  def initialize
    self.analytics = SegmentAnalytics.new
  end

  def track(teacher, student)
    # do in following order so we identify the teacher last
    track_for_student(student)
    track_for_teacher(teacher)
  end

  private

  def track_for_student student
    analytics_identify(student)
    analytics_track({
      user_id: student.id,
      event: SegmentIo::Events::STUDENT_ACCOUNT_CREATION,
      context: {:ip => student.ip_address },
      integrations: { intercom: 'false' }
    })
  end

  def track_for_teacher teacher
    analytics_identify(teacher)
    analytics_track({
      user_id: teacher.id,
      event: SegmentIo::Events::TEACHERS_STUDENT_ACCOUNT_CREATION,
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
