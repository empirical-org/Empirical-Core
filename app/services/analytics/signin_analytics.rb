class SigninAnalytics
  attr_accessor :analytics

  def initialize
    analytics = SegmentAnalytics.new
  end

  def track_teacher_signin(teacher)
    track({
      user_id: teacher.id,
      event: SegmentIo::Events::TEACHER_SIGNIN
    })
  end

  def track_student_signin(student)
    track_teachers_student_signin(student)
    track_student_signin_proper(student)
  end

  private

  def track hash
    analytics.track hash
  end

  def track_student_signin_proper(student)
    track({
      user_id: student.id,
      event: SegmentIo::Events::STUDENT_SIGNIN
    })
  end

  def track_teachers_student_signin(student)
    teacher = student.teacher
    return if teacher.nil?
    track({
      user_id: teacher.id,
      event: SegmentIo::Events::TEACHERS_STUDENT_SIGNIN
    })
  end

end