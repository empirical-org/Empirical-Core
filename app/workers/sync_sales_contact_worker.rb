class SyncSalesContactWorker
  include Sidekiq::Worker

  def perform(teacher_id)
    SalesContactSyncer.new(teacher_id).sync
  end
end
