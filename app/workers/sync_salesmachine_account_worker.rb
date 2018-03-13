class SyncSalesmachineAccountWorker
  include Sidekiq::Worker

  def perform(school_id)
    SyncSalesmachineAccount.new(school_id).sync
  end
end
