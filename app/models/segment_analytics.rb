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

  # All events should be defined as instance methods like so:
  #
  # def track_user_sign_in
  #  identify
  #  track(
  #    {
  #      user_id: user.id,
  #      event: 'Sign In User'
  #    }
  #  )
  # end

  def track_student_creation(student_user)
    identify(student_user)
    track({
      user_id: student_user.id,
      event: SegmentIo::Events::STUDENT_ACCOUNT_CREATION,
      properties: {
        student: StudentSerializer.new(student_user).as_json(root: false)
      }
    })
  end

  def track_teacher_creation(teacher_user)
    identify(teacher_user)
    track({
      user_id: teacher_user.id,
      event: SegmentIo::Events::TEACHER_ACCOUNT_CREATION,
      properties: {
        teacher: TeacherSerializer.new(teacher_user).as_json(root: false)
      }
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
    UserSerializer.new(user).as_json(root: false)
  end

  def track(options)
    backend.track(options)
  end
end