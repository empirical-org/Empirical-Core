# frozen_string_literal: true

class TeacherApprovedToBecomeAdminAnalyticsWorker
  include Sidekiq::Worker

  def perform(user_id, new_user)
    analyzer = Analytics::Analyzer.new
    user = User.find_by_id(user_id)

    event = new_user ? Analytics::SegmentIo::BackgroundEvents::NEW_USER_APPROVED_TO_BECOME_ADMIN : Analytics::SegmentIo::BackgroundEvents::TEACHER_APPROVED_TO_BECOME_ADMIN
    analyzer.track(user, event)
  end
end
