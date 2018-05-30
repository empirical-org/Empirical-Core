class SyncSalesAccountWorker
  include Sidekiq::Worker

  def perform(school_id)
    SalesAccountSyncer.new(school_id).sync
  end
end
