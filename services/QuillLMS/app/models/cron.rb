class Cron
  # Configured in Heroku Scheduler to run every 10 minutes
  def self.interval_10_min

  end

  # Configured in Heroku Scheduler to run every hour on the XX:30 mark
  def self.interval_1_hour
    CreditReferringAccountsWorker.perform_async
  end

  # Configured in Heroku Scheduler to run every day at 07:00UTC
  # Which is 02:00 or 03:00 Eastern depending on Daylight Savings
  def self.interval_1_day
    run_saturday if now.wday == 6

    # Rake tasks to migrate
    #staff:check
    #update_todays_expired_recurring_subscriptions
    #sync_salesmachine
    #recommendation_assignments_report:email
    #number_of_students_sentences_and_cities:set
  end

  def self.run_saturday
    UploadLeapReportWorker.perform_async(29087)
  end

  def self.now
    # We use UTC here to match the clock used for Heroku Scheduler
    @t ||= Time.now.in_time_zone('UTC')
  end
end
