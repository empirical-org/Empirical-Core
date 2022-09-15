# frozen_string_literal: true

class FinishActivityWorker
  include Sidekiq::Worker


  def perform(uid)

    activity_session = ActivitySession.find_by_uid(uid)
    return if activity_session.nil?

    event_data = {
      event: 'finished',
      uid: activity_session.uid,
      percentage: activity_session.percentage,
      percentile: activity_session.percentile,
      activity: ActivitySerializer.new(activity_session.activity),
      event_started: activity_session.started_at,
      event_finished: activity_session.completed_at
    }

    if activity_session.user_id.nil?
      event_data.merge!(anonymous: true)
    else
      event_data.merge!(anonymous: false, student: StudentSerializer.new(activity_session.user))
    end

    return unless activity_session.eligible_for_tracking?

    analytics = SegmentAnalytics.new
    analytics.track_activity_completion(activity_session.classroom_owner, activity_session.user_id, activity_session.activity, activity_session)
  end
end
