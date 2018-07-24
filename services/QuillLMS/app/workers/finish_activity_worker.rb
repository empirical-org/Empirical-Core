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

    if activity_session.eligible_for_tracking?
      analytics = Analyzer.new
      analytics.track(activity_session.classroom_owner, SegmentIo::Events::ACTIVITY_COMPLETION)
    end
    
    # add it to the student's scorebook
    #
    # anything else?

  end
end
