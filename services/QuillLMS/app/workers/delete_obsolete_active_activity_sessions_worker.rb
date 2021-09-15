class DeleteObsoleteActiveActivitySessionsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform
    obsolete_query.in_batches.delete_all
  end

  private def obsolete_query
    ActiveActivitySession
      .select(:id)
      .obsolete
  end
end
