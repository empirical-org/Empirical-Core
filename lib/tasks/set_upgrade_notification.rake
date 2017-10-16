namespace :upgrade do
  task :set_upgrade_vars, [:start_time, :end_time] => [:environment] do |t, args|
    if args[:start_time] && args[:end_time] && Time.parse(args[:start_time]) && Time.parse(args[:end_time])
      sh %Q{curl -n -X PATCH https://api.heroku.com/apps/#{ENV['APP_NAME']}/config-vars \
          -d '{
          "UPGRADE": "true",
          "UPGRADE_START_TIME": #{args[:start_time]},
          "UPGRADE_END_TIME": #{args[:end_time]}
        }' \
          -H "Content-Type: application/json" \
          -H "Accept: application/vnd.heroku+json; version=3"}
    else
      puts "You need to specify a start time and an end time for this task. Use the following command:"
      puts "rake 'upgrade:set_upgrade_vars[START_DATETIME_STRING, END_DATETIME_STRING]'"
    end
  end
end
