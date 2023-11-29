class Cron

  def self.run
    current_time = Time.zone.now

    return unless current_time.hour == 3

    beginning_of_yesterday = current_time.yesterday.beginning_of_day
    end_of_yesterday = current_time.yesterday.end_of_day

    queue_elastic_search_for_range(beginning_of_yesterday, end_of_yesterday, 24)
    queue_elastic_search_for_range(current_time.beginning_of_day, current_time, 3)

    RefreshAllResponsesViewsWorker.perform_async
  end

  def self.queue_elastic_search_for_range(start_time, end_time, parts)
    TimeRangeSplitter.run(start_time, end_time, parts).each do |range|
      UpdateElasticsearchWorker.perform_async(range.begin, range.end)
    end
  end
end
