class ConceptReplacementWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform(original_concept_id, new_concept_id)
    original_concept = Concept.find(original_concept_id)
    new_concept = Concept.find(new_concept_id)

    ConceptReplacementLMSWorker.perform_async(original_concept_id, new_concept_id)
    ConceptReplacementCMSWorker.perform_async(original_concept.uid, new_concept.uid)
    ConceptReplacementGrammarWorker.perform_async(original_concept.uid, new_concept.uid)
    ConceptReplacementProofreaderWorker.perform_async(original_concept.uid, new_concept.uid)
    ConceptReplacementConnectWorker.perform_async(original_concept.uid, new_concept.uid)
  end

end
