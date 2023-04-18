# frozen_string_literal: true

class TeacherDeniedToBecomeAdminAnalyticsWorker
  include Sidekiq::Worker

  def perform(user_id, new_user)
    analyzer = Analyzer.new
    user = User.find_by_id(user_id)

    event = new_user ? SegmentIo::BackgroundEvents::NEW_USER_DENIED_TO_BECOME_ADMIN : SegmentIo::BackgroundEvents::TEACHER_DENIED_TO_BECOME_ADMIN
    analyzer.track(user, event)
  end
end
