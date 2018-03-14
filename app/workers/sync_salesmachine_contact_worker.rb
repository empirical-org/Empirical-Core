class SyncSalesmachineContactWorker
  include Sidekiq::Worker

  def perform(teacher_id)
    SyncSalesmachineContact.new(teacher_id).sync
  end
end
