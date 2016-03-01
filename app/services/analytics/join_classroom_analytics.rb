class JoinClassroomAnalytics
  attr_accessor :analytics

  include StudentsTeacher

  def initialize
    self.analytics = SegmentAnalytics.new
  end


  def track student
    teacher = StudentsTeacher.run(student)
    return if teacher.nil?
    analytics_identify(teacher)
    analytics_track({
      user_id: teacher.id,
      event: SegmentIo::Events::TEACHERS_STUDENT_ACCOUNT_CREATION,
      context: {:ip => teacher.ip_address }
    })
  end

  private

  def analytics_track hash
    analytics.track hash
  end

  def analytics_identify user
    analytics.identify(user)
  end
end
