class Cron

  def self.run
    current_time = Time.zone.now

    return unless current_time.hour == 3

    RefreshAllResponsesViewsWorker.perform_async
  end
end
