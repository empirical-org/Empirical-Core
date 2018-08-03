class SyncSalesAccountWorker
  include Sidekiq::Worker

  def perform(school_id)
    SyncSalesAccount.new(school_id).call
  end
end
