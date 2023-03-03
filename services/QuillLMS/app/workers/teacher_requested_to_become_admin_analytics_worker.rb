# frozen_string_literal: true

class TeacherRequestedToBecomeAdminAnalyticsWorker
  include Sidekiq::Worker

  def perform(user_id)
    analytics = SegmentAnalytics.new
    analytics.track_event_from_string(Segment::BackgroundEvents::TEACHER_REQUESTED_TO_BECOME_ADMIN, user_id)
  end
end
