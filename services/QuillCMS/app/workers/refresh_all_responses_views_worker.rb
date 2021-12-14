class RefreshAllResponsesViewsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  MINUTE_STRING = 'min'
  DEFAULT_INTERVAL = 600 # 10 minutes
  MINUTES_IN_HOUR = 60

  def perform
    timeout = RefreshResponsesViewWorker::REFRESH_TIMEOUT

    interval = MINUTE_STRING.in?(timeout) ? (timeout.gsub(MINUTE_STRING,'').to_i * MINUTES_IN_HOUR) : DEFAULT_INTERVAL

    RefreshResponsesViewWorker::VIEWS.each.with_index do |view, index|
      RefreshResponsesViewWorker.perform_in(index * interval, view)
    end
  end
end
