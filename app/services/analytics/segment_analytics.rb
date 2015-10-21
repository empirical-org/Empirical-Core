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

  def track_classroom_creation(classroom)
    track({
      user_id: classroom.teacher.id,
      event: SegmentIo::Events::CLASSROOM_CREATION
    })
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


  def identify(user)
    backend.identify(identify_params(user))
  end


  private


  def anonymous_uid
    SecureRandom.urlsafe_base64
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