namespace :keen do

  desc "bulk import activity_sessions"
  task :activity_sessions => :environment do

    iter = 1

    ActivitySession.started_or_better.in_groups_of(2500) do |group|

      fh = open("activity-sessions-#{iter}.json", 'a')

      group.each do |as|
        fh.write("#{create_initial_event(as)}\n") if as.completed?
        fh.write("#{as.as_keen.to_json}\n")
      end

      fh.close
      iter += 1
    end


  end


  def create_initial_event(activity_session)
    event_data = {
      event: 'started',
      uid: activity_session.uid,
      time_spent: 0,
      activity: ActivitySerializer.new(activity_session.activity, root: false),
      event_started: activity_session.started_at,
      event_finished: nil,
      keen: {
        timestamp: activity_session.started_at
      }
    }

    if activity_session.user_id.nil?
      event_data.merge!(anonymous: true)
    else
      event_data.merge!(anonymous: false, student: StudentSerializer.new(activity_session.user, root: false))
    end

    event_data.to_json
  end

end
