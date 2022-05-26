# frozen_string_literal: true

class CopyConceptResultsToResponsesWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  BATCH_SIZE=100000

  def perform(start, finish)
    (start..finish).each do |id|
      concept_result = ConceptResult.find_by_id(id)
      Response.find_or_create_from_concept_result(concept_result) if concept_result
    end
  end
end
