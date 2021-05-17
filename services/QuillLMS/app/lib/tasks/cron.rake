namespace :cron do
  desc "Process Cron's 10 minute interval logic"
  task interval_10_minutes: :environment do
    Cron.interval_10_min
  end

  desc "Process Cron's 1 hour interval logic"
  task interval_1_hour: :environment do
    Cron.interval_1_hour
  end

  desc "Process Cron's 1 day interval logic"
  task interval_1_day: :environment do
    Cron.interval_1_day
  end

end
