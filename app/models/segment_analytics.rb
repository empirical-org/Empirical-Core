class SegmentAnalytics
  # The actual backend that this uses to talk with segment.io.
  # This will be a fake backend under test and a real object
  # elsewhere.
  class_attribute :backend

  def initialize
    # Do not clobber the backend object if we already set a fake one under test
    self.backend ||= Segment::Analytics.new({
      write_key: SegmentIo.configuration.write_key,
      on_error: Proc.new { |status, msg| print msg }
    })
  end

  def track_activity_assignment(teacher)
    track({
      user_id: teacher.id,
      event: SegmentIo::Events::ACTIVITY_ASSIGNMENT
    })
  end

  def track_activity_completion(activity_session)
    return if activity_session.classroom_activity.nil?
    return if activity_session.classroom_activity.classroom.nil?
    track({
      user_id: activity_session.classroom_activity.classroom.teacher.id,
      event: SegmentIo::Events::ACTIVITY_COMPLETION
    })
  end

  def track_classroom_creation(classroom)
    track({
      user_id: classroom.teacher.id,
      event: SegmentIo::Events::CLASSROOM_CREATION
    })
  end

  def track_student_creation_by_teacher(teacher, student)
    track({
      user_id: teacher.id,
      event: SegmentIo::Events::STUDENT_ACCOUNT_CREATION_BY_TEACHER
    })
  end

  def track_teacher_creation(teacher)
    identify(teacher)
    track({
      user_id: teacher.id,
      event: SegmentIo::Events::TEACHER_ACCOUNT_CREATION
    })
  end

  def track_teacher_signin(teacher)
    identify(teacher)
    track({
      user_id: teacher.id,
      event: SegmentIo::Events::TEACHER_SIGNIN
    })
  end

  private

  def identify(user)
    backend.identify(identify_params(user))
  end

  def identify_params(user)
    {
      user_id: user.id,
      traits: user_traits(user)
    }
  end

  def user_traits(user)
    SegmentAnalyticsUserSerializer.new(user).as_json(root: false)
  end

  def track(options)
    backend.track(options)
  end
end