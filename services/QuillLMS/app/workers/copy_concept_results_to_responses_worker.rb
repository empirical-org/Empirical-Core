# frozen_string_literal: true

class CopyConceptResultsToResponsesWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  BATCH_SIZE=100000

  def perform(start, finish)
    ConceptResult.find_in_batches(start: start, finish: finish, batch_size: BATCH_SIZE) do |concept_results_batch|
      concept_results_batch.each do |concept_result|
        Response.find_or_create_from_concept_result(concept_result)
      end
    end
  end
end
