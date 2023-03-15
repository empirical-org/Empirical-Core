# frozen_string_literal: true

class TeacherRequestedToBecomeAdminAnalyticsWorker
  include Sidekiq::Worker

  def perform(user_id)
    analyzer = Analyzer.new
    user = User.find_by_id(user_id)

    analyzer.track(user, SegmentIo::BackgroundEvents::TEACHER_REQUESTED_TO_BECOME_ADMIN)
  end
end
