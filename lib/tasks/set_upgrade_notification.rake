namespace :upgrade do
  task :set_upgrade_vars, [:app_name, :start_time, :end_time] => [:environment] do |t, args|
    app_name = args[:app_name].downcase
    if (app_name == 'empirical-grammar' || app_name == 'empirical-grammar-staging') && args[:start_time] && args[:end_time] && Time.parse(args[:start_time]) && Time.parse(args[:end_time])
      system "heroku config:set --app #{app_name} UPGRADE=true UPGRADE_START_TIME=#{args[:start_time]} UPGRADE_END_TIME=#{args[:end_time]}"
    else
      puts "You need to specify an app name, start time, and end time for this task. Use the following command:"
      puts "rake 'upgrade:set_upgrade_vars[APP_NAME, START_DATETIME_STRING, END_DATETIME_STRING]'"
    end
  end
end
