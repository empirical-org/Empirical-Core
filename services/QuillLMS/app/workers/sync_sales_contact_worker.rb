class SyncSalesContactWorker
  include Sidekiq::Worker

  def perform(teacher_id)
    SyncSalesContact.new(teacher_id).call
  end
end
