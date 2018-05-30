class InvalidClasscodeWorker
  include Sidekiq::Worker

  def perform(student_id, user_inputted_classcode, formatted_classcode)
    analytics = InvalidClasscodeAnalytics.new(student_id, user_inputted_classcode, formatted_classcode)
    analytics.track
  end
end
