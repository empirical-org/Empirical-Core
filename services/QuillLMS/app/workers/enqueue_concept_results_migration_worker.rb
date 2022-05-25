# frozen_string_literal: true

class EnqueueConceptResultsMigrationWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  BATCH_SIZE=100000

  def perform(start, finish)
    start = start || 1
    finish = finish || ConceptResult.maximum(:id)

    while start < finish
      end_of_batch = [start + BATCH_SIZE, finish].min
      CopyConceptResultsToResponsesWorker.perform_async(start, end_of_batch)
      start += BATCH_SIZE
    end
  end
end
