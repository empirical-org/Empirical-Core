namespace :upgrade do
  task :set_upgrade_vars, [:start_time, :end_time] => [:environment] do |t, args|
    if args[:start_time] && args[:end_time] && Time.parse(args[:start_time]) && Time.parse(args[:end_time])
      system "heroku config:set --app #{ENV['APP_NAME']} UPGRADE=true UPGRADE_START_TIME=#{args[:start_time]} UPGRADE_END_TIME=#{args[:end_time]}"
    else
      puts "You need to specify a start time and an end time for this task. Use the following command:"
      puts "rake 'upgrade:set_upgrade_vars[START_DATETIME_STRING, END_DATETIME_STRING]'"
    end
  end
end
