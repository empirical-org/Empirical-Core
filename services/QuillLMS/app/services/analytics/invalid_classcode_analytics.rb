class InvalidClasscodeAnalytics
  attr_accessor :analytics


  def initialize(student_id, user_inputted_classcode, formatted_classcode)
    self.analytics = SegmentAnalytics.new
    @user_inputted_classcode = user_inputted_classcode
    @formatted_classcode = formatted_classcode
    @student_id = student_id
  end

  def track
    student = User.find @student_id
    analytics_identify(student)
    analytics_track({
      user_id: @student_id,
      event: SegmentIo::Events::STUDENT_ENTERED_INVALID_CLASSCODE,
      properties: {user_inputted_classcode: @user_inputted_classcode,
                formatted_classcode: @formatted_classcode
      },
      integrations: { intercom: 'false' }
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
