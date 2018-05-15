class SalesContactAnalyticsWorker
  include Sidekiq::Worker

  def perform(id, sales_stage)
    SalesContactAnalytics.new(id, sales_stage).track
  end
end
