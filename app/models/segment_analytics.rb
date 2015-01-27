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
      event: 'Student Account Creation',
      properties: {
        student: StudentSerializer.new(student_user).as_json(root: false)
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
    {
      # email: user.email,
      # first_name: user.first_name,
      # last_name: user.last_name,
      # city_state: user.city_state,
    }.reject { |key, value| value.blank? }
  end

  def track(options)
    backend.track(options)
  end
end