# frozen_string_literal: true

class SaveActivitySessionConceptResultsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::MIGRATION

  def perform(old_concept_result_ids)
    OldConceptResult.where(id: old_concept_result_ids).each do |old_concept_result|
      ConceptResult.find_or_create_from_old_concept_result(old_concept_result)
    end
  end
end
