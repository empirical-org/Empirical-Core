class Cron

  def self.run
    current_time = Time.now
    if current_time.hour == 23
      UpdateElasticsearchWorker.perform_async(current_time)
    end
  end
end
