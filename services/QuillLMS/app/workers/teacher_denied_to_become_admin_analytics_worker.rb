# frozen_string_literal: true

class TeacherDeniedToBecomeAdminAnalyticsWorker
  include Sidekiq::Worker

  def perform(user_id)
    analyzer = Analyzer.new
    user = User.find_by_id(user_id)

    analyzer.track(user, SegmentIo::BackgroundEvents::TEACHER_DENIED_TO_BECOME_ADMIN)
  end
end
