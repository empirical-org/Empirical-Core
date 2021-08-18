class Cron

  def self.run
    current_time = Time.zone.now

    return unless current_time.hour == 3

    update_elasticsearch(current_time)
    refresh_response_views
  end

  private_class_method def self.update_elasticsearch(time)
    beginning_of_yesterday = time.yesterday.beginning_of_day
    end_of_yesterday = time.yesterday.end_of_day

    UpdateElasticsearchWorker.perform_async(beginning_of_yesterday, end_of_yesterday)
    UpdateElasticsearchWorker.perform_async(time.beginning_of_day, time)
  end

  private_class_method def self.refresh_response_views
    # spread out run by the length of timeout to run them separately
    # default to 10 minutes
    minute_string = 'min'
    timeout = RefreshResponsesViewWorker::REFRESH_TIMEOUT
    default_interval = 600 # 10 minutes

    interval = minute_string.in?(timeout) ? (timeout.gsub(minute_string,'').to_i * 60) : default_inteveral

    RefreshResponsesViewWorker::VIEWS.each.with_index do |view, index|
      RefreshResponsesViewWorker.perform_in(index * interval, view)
    end
  end
end
