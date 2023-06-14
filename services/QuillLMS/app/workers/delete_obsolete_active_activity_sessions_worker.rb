# frozen_string_literal: true

class DeleteObsoleteActiveActivitySessionsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  BATCH_SIZE = 1_000

  def perform
    while obsolete_query.delete_all > 0
      # empty loop since condtional is also the action
    end
  end

  private def obsolete_query
    ActiveActivitySession
      .obsolete
      .limit(BATCH_SIZE)
  end
end
