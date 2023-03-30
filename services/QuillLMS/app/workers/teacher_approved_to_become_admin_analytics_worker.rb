# frozen_string_literal: true

class TeacherApprovedToBecomeAdminAnalyticsWorker
  include Sidekiq::Worker

  def perform(user_id, new_user)
    analyzer = Analyzer.new
    user = User.find_by_id(user_id)

    event = new_user ? SegmentIo::BackgroundEvents::NEW_USER_APPROVED_TO_BECOME_ADMIN : SegmentIo::BackgroundEvents::TEACHER_APPROVED_TO_BECOME_ADMIN
    analyzer.track(user, event)
  end
end
