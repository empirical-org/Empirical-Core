class SigninAnalytics
  attr_accessor :analytics

  def initialize
    self.analytics = SegmentAnalytics.new
  end

  def track_teacher(teacher)
    analytics_identify(teacher)
    analytics_track({
      user_id: teacher.id,
      event: SegmentIo::Events::TEACHER_SIGNIN,
      context: {:ip => teacher.ip_address }
    })
  end

  def track_student(student)
    # keep these in the following order so the student is the last one identified
    track_teachers_student(student)
    track_student_proper(student)
  end

  private

  def analytics_track hash
    analytics.track hash
  end

  def analytics_identify(user)
    analytics.identify(user)
  end

  def track_student_proper(student)
    analytics_identify(student)
    analytics_track({
      user_id: student.id,
      event: SegmentIo::Events::STUDENT_SIGNIN,
      context: {:ip => student.ip_address },
      integrations: { all: true, Intercom: false }
    })
  end

  def track_teachers_student(student)
    teacher = StudentsTeacher.run(student)
    return if teacher.nil?
    analytics_identify(teacher)
    analytics_track({
      user_id: teacher.id,
      event: SegmentIo::Events::TEACHERS_STUDENT_SIGNIN,
      context: {:ip => teacher.ip_address }
    })
  end

end
