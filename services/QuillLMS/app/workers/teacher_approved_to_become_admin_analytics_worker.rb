# frozen_string_literal: true

class TeacherApprovedToBecomeAdminAnalyticsWorker
  include Sidekiq::Worker

  def perform(user_id)
    analyzer = Analyzer.new
    user = User.find_by_id(user_id)

    analyzer.track(user, SegmentIo::BackgroundEvents::TEACHER_APPROVED_TO_BECOME_ADMIN)
  end
end
