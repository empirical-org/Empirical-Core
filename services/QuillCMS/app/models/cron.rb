class Cron

  def self.run
    current_time = Time.zone.now
    # if current_time.hour == 3
    beginning_of_yesterday = current_time.yesterday.beginning_of_day
    end_of_yesterday = current_time.yesterday.end_of_day
    UpdateElasticsearchWorker.perform_async(beginning_of_yesterday, end_of_yesterday)
    UpdateElasticsearchWorker.perform_async(current_time.beginning_of_day, current_time)
    # end
  end
end
