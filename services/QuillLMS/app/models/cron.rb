# frozen_string_literal: true

class Cron

  # Configured in Heroku Scheduler to run every 10 minutes
  def self.interval_10_min
    run_at_20_minute_mark if now.min.between?(20, 29)
    run_at_50_minute_mark if now.min.between?(50, 59)
  end

  # Configured in Heroku Scheduler to run every hour on the XX:30 mark
  def self.interval_1_hour
    CreditReferringAccountsWorker.perform_async
    TeacherNotifications::EnqueueUsersForRollupEmailWorker.perform_async(TeacherInfo::HOURLY_EMAIL)
  end

  # Configured in Heroku Scheduler to run every day at 07:00UTC
  # Which is 02:00 or 03:00 Eastern depending on Daylight Savings
  # rubocop:disable Metrics/CyclomaticComplexity
  def self.interval_1_day
    run_monday if now.wday == 1
    run_friday if now.wday == 5
    run_saturday if now.wday == 6
    run_weekday if (1..5).include?(now.wday)
    run_school_year_start if now.month == 7 && now.day == 1
    run_monthly if now.day == 1

    # pass yesterday's date for stats email queries and labels
    date = Time.current.getlocal('-05:00').yesterday

    # internal analytics and security
    DailyStatsEmailJob.perform_async(date)
    QuillStaffAccountsChangedWorker.perform_async

    # subscriptions
    RenewExpiringRecurringSubscriptionsWorker.perform_async
    AlertSoonToExpireSubscriptionsWorker.perform_async

    # demo
    Demo::RecreateAccountWorker.perform_async

    # third party analytics
    SyncVitallyWorker.perform_async
    CalculateAndCacheSchoolsDataForSegmentWorker.perform_async
    SendSegmentIdentifyCallForAllAdminsWorker.perform_async

    # caching
    MaterializedViewRefreshWorker.perform_async
    RematchUpdatedQuestionsWorker.perform_async(date.beginning_of_day, date.end_of_day)
    PreCachePremiumHubsWorker.perform_async
    PopulateAggregatedEvidenceActivityHealthsWorker.perform_async
    Question::TYPES.each { |type| RefreshQuestionCacheWorker.perform_async(type) }

    # Email notifications
    TeacherNotifications::EnqueueUsersForRollupEmailWorker.perform_async(TeacherInfo::DAILY_EMAIL)
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  # Configured in Heroku Scheduler to run at XX:20
  def self.run_at_20_minute_mark
    ResetGhostInspectorAccountWorker.perform_async
  end

  # Configured in Heroku Scheduler to run at XX:50
  def self.run_at_50_minute_mark
    ResetGhostInspectorAccountWorker.perform_async
  end

  def self.run_weekday
    IdentifyStripeInvoicesWithoutSubscriptionsWorker.perform_async
  end

  def self.run_monday
    Pdfs::SendWeeklySubscriptionsWorker.perform_async
  end

  def self.run_friday
    TeacherNotifications::EnqueueUsersForRollupEmailWorker.perform_async(TeacherInfo::WEEKLY_EMAIL)
  end

  def self.run_saturday
    SetImpactMetricsWorker.perform_async
    UploadLeapReportWorker.perform_async(29_087)
    PopulateAllActivityHealthsWorker.perform_async
    DeleteObsoleteActiveActivitySessionsWorker.perform_async
  end

  def self.run_monthly
    Pdfs::SendMonthlySubscriptionsWorker.perform_async
  end

  def self.run_school_year_start
    PopulateAnnualVitallyWorker.perform_async
  end

  def self.now
    # We use UTC here to match the clock used for Heroku Scheduler
    @t ||= Time.current.utc
  end
end
