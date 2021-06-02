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
    # pass yesterday's date for stats email queries and labels
    date = Time.now.getlocal('-05:00').yesterday

    DailyStatsEmailJob.perform_async(date)
    QuillStaffAccountsChangedWorker.perform_async
    RenewExpiringRecurringSubscriptionsWorker.perform_async
    ResetDemoAccountWorker.perform_async
    SyncVitallyWorker.perform_async
    MaterializedViewRefreshWorker.perform_async
  end

  def self.run_saturday
    SetImpactMetricsWorker.perform_async
    UploadLeapReportWorker.perform_async(29087)
    PopulateAllActivityHealthsWorker.perform_async
  end

  def self.now
    # We use UTC here to match the clock used for Heroku Scheduler
    @t ||= Time.now.in_time_zone('UTC')
  end
end
