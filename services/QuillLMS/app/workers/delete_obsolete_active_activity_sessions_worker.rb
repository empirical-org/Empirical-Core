class DeleteObsoleteActiveActivitySessionsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW
  BATCH_SIZE = 1_000

  def perform
    loop do
      obsolete = obsolete_query

      break if obsolete.empty?

      obsolete.destroy_all
    end
  end

  private def obsolete_query
    ActiveActivitySession
      .select(:id)
      .obsolete
      .limit(BATCH_SIZE)
  end
end
