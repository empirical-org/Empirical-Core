class SegmentAnalytics
  # The actual backend that this uses to talk with segment.io.
  # This will be a fake backend under test and a real object
  # elsewhere.
  class_attribute :backend


  # TODO : split this all out in the way that SigninAnalytics splits out

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

  def track_student_account_creation(student)
    track_teachers_student_account_creation(student)
    track_student_account_creation_proper(student)
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

  def track_click_sign_up
    track({
      user_id: anonymous_uid,
      event: SegmentIo::Events::CLICK_SIGN_UP
    })
  end


  def track(options)
    backend.track(options)
  end

  private

  def track_teachers_student_account_creation(student)
    teacher = student.teacher
    return if teacher.student.nil?
    track({
      user_id: teacher.id,
      event: SegmentIo::Events::TEACHERS_STUDENT_ACCOUNT_CREATION
    })
  end

  def track_student_account_creation_proper(student)
    track({
      user_id: student.id,
      event: SegmentIo::Events::STUDENT_ACCOUNT_CREATION
    })
  end



  def anonymous_uid
    SecureRandom.urlsafe_base64
  end

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

end