class Cron

  def self.run
    current_time = Time.zone.now
    if current_time.hour == 3
      UpdateElasticsearchWorker.perform_async(current_time)
    end
  end
end
