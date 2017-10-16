namespace :upgrade do
  task :upgrading, [:start_time, :end_time] => [:environment] do |t, args|
    system "heroku config:set --app empirical-grammar-staging UPGRADE=true"
    system "heroku config:set --app empirical-grammar-staging UPGRADE_START_TIME=#{args[:start_time]}"
    system "heroku config:set --app empirical-grammar-staging UPGRADE_END_TIME=#{args[:end_time]}"
    # system "heroku restart -a "
  end
end
