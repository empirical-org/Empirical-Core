namespace :cron do
  desc "Trigger the Cron model's `run` class method.  This is intended to be run hourly."
  task run: :environment do
    Cron.run
  end
end
