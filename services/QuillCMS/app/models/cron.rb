class Cron

  def self.run
    current_time = Time.zone.now
    UpdateElasticsearchWorker.perform_async(current_time)
  end
end
