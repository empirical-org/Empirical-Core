class ConceptReplacementLMSWorker
  include Sidekiq::Worker

  def perform(original_concept_id, new_concept_id)
    ConceptResult.where(concept_id: original_concept_id).update_all(concept_id: new_concept_id)
  end

end
