class SegmentAnalytics
  # The actual backend that this uses to talk with segment.io.
  # This will be a fake backend under test and a real object
  # elsewhere.
  class_attribute :backend

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

  # def track_test(user_id)
  #   identify(identify_params(user_id))
  #   track({user: user_id})
  # end

  private

  def identify(options)
    backend.identify(options)
  end

  def identify_params(user_id)
    {
      user_id: user_id,
      traits: {}
    }
  end

  # def user_traits
  #   {
  #     email: user.email,
  #     first_name: user.first_name,
  #     last_name: user.last_name,
  #     city_state: user.city_state,
  #   }.reject { |key, value| value.blank? }
  # end

  def track(options)
    backend.track(options)
  end
end