namespace :keen do

  desc "bulk import activity_sessions"
  task :activity_sessions => :environment do

    iter = 1

    ActivitySession.all.in_groups_of(2500) do |group|

      fh = open("activity-sessions-#{iter}.json", 'a')

      group.each do |as|
        fh.write(create_initial_event(as))
        fh.write(create_final_event(as))
      end

      fh.close
      iter += 1
    end


  end


  def create_initial_event(activity_session)
    event_data = {
      event: 'start',
      uid: activity_session.uid,
      time_spent: 0,
      activity: ActivitySerializer.new(activity_session.activity),
      event_started: activity_session.created_at,
      event_finished: nil,
      keen: {
        timestamp: activity_session.created_at
      }
    }

    if activity_session.user_id.nil?
      event_data.merge!(anonymous: true)
    else
      event_data.merge!(anonymous: false, student: StudentSerializer.new(activity_session.user))
    end

    event_data.to_json
  end


  def create_final_event(activity_session)
    # set the time taken
    activity_session.calculate_time_spent! if activity_session.time_spent.blank?

    event_data = {
      event: 'finished',
      uid: activity_session.uid,
      time_spent: activity_session.time_spent,
      activity: ActivitySerializer.new(activity_session.activity),
      event_started: activity_session.created_at,
      event_finished: activity_session.completed_at,
      keen: {
        timestamp: activity_session.created_at
      }
    }

    if activity_session.user_id.nil?
      event_data.merge!(anonymous: true)
    else
      event_data.merge!(anonymous: false, student: StudentSerializer.new(activity_session.user))
    end

    event_data.to_json
  end
end
