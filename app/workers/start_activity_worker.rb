class StartActivityWorker
  include Sidekiq::Worker

  def perform(uid, start_time, attempts=0)

    activity_session = ActivitySession.find_by_uid(uid)

    # session may not exist yet...
    if activity_session.nil?
      if attempts < 5
        StartActivityWorker.perform_in(2.minutes, uid, start_time, attempts + 1)
      else
        # missing session; ignore for now....
      end
      return
    end


    # yay, we started!
    activity_session.update_columns(started_at: start_time)

    # publish event data
    KeenWrapper.publish(:activity_sessions, activity_session.as_keen)

    # add it to the student's scorebook
    #
    # anything else?

  end
end
