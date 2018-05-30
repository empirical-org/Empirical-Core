class SalesContactUpdaterWorker
  include Sidekiq::Worker

  def perform(id, sales_stage_number)
    SalesContactUpdater.new(id, sales_stage_number).update
  end
end
