# frozen_string_literal: true

class ConceptReplacementLMSWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform(original_concept_id, new_concept_id)
    ConceptResultOld.where(concept_id: original_concept_id).update_all(concept_id: new_concept_id)
    Criterion.where(concept_id: original_concept_id).update_all(concept_id: new_concept_id)
    Concept.unscoped.find(original_concept_id).update(visible: false, replacement_id: new_concept_id)
  end

end
