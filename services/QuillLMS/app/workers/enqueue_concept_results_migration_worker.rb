# frozen_string_literal: true

class EnqueueConceptResultsMigrationWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  BATCH_SIZE=100000

  def perform(start, finish)
    ConceptResult.select(:id).find_in_batches(start: start, finish: finish, batch_size: BATCH_SIZE) do |concept_result_ids|
      CopyConceptResultsToStudentResponsesWorker.perform_async(concept_result_ids.map(&:id))
    end
  end
end
