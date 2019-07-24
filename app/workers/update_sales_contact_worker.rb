class UpdateSalesContactWorker
  include Sidekiq::Worker

  def perform(id, sales_stage_number)
    UpdateSalesContact.new(id, sales_stage_number).call
  end
end
