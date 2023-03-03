# frozen_string_literal: true

class TeacherApprovedToBecomeAdminAnalyticsWorker
  include Sidekiq::Worker

  def perform(user_id)
    analytics = SegmentAnalytics.new
    analytics.track_event_from_string(SegmentIo::BackgroundEvents::TEACHER_APPROVED_TO_BECOME_ADMIN, user_id)
  end
end
