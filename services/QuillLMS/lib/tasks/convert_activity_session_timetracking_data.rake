# frozen_string_literal: true

namespace :activity_session_timetracking_data do
  desc 'updates data that had formerly been saved as json in hstore to be parsable in jsonb'
  task :convert => :environment do
    ActivitySession.where("activity_sessions.data->'time_tracking' IS NOT NULL").each do |as|
      if as.data['time_tracking'].instance_of? String
        time_tracking = JSON.parse(as.data['time_tracking'])
        as.data = { time_tracking: time_tracking }
        as.save
      end
    end
  end
end
