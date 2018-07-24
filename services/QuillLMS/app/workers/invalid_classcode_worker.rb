class InvalidClasscodeWorker
  include Sidekiq::Worker

  def perform(student_id, user_inputted_classcode, formatted_classcode)
    student = User.find student_id
    analytics = Analyzer.new
    analytics.track_with_attributes(
      student,
      SegmentIo::Events::STUDENT_ENTERED_INVALID_CLASSCODE,
      {
        properties: {
          user_inputted_classcode: user_inputted_classcode,
         formatted_classcode: formatted_classcode
        },
      integrations: { intercom: 'false' }
      }
    )
  end
end
