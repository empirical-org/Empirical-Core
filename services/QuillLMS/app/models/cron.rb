class Cron
  def self.interval_10_min

  end

  def self.interval_1_hour

  end

  def self.interval_1_day
    run_saturday if now.wday == 6
  end

  def self.run_saturday
    UploadLeapReportWorker.perform_async(29087)
  end

  def self.now
    @t ||= Time.now.in_time_zone('Eastern Time (US & Canada)')
  end
end
