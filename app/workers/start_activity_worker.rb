class StartActivityWorker
  include Sidekiq::Worker

  def perform(uid)

    activity_session = ActivitySession.find_by_uid(uid)

    event_data = {
      event: 'start',
      uid: activity_session.uid,
      time_spent: 0,
      activity: ActivitySerializer.new(activity_session.activity),
      event_started: activity_session.created_at,
      event_finished: nil
    }

    if activity_session.user_id.nil?
      event_data.merge!(anonymous: true)
    else
      event_data.merge!(anonymous: false, student: StudentSerializer.new(activity_session.user))
    end

    # publish event data
    Keen.publish(:activity, event_data)

    # add it to the student's scorebook
    #
    # anything else?

  end
end
