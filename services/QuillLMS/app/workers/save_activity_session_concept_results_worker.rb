# frozen_string_literal: true

class SaveActivitySessionConceptResultsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::MIGRATION

  def perform(concept_results_hashes)
    ConceptResult.bulk_create_from_json(concept_results_hashes)
  end
end
