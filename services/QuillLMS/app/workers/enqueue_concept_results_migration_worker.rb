# frozen_string_literal: true

class EnqueueConceptResultsMigrationWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::MIGRATION

  BATCH_SIZE=100_000

  def perform(start, finish)
    start ||= 1
    finish ||= ConceptResult.maximum(:id)

    while start < finish
      end_of_batch = [start + BATCH_SIZE - 1, finish].min
      CopyConceptResultsToResponsesWorker.perform_async(start, end_of_batch)
      start += BATCH_SIZE
    end
  end
end
