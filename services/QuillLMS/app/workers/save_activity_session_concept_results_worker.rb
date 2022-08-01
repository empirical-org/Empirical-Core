# frozen_string_literal: true

class SaveActivitySessionConceptResultsWorker
  include Sidekiq::Worker

  class ConceptResultCopyFailedException < StandardError;end

  def perform(old_concept_result_ids)
    OldConceptResult.where(id: old_concept_result_ids).each do |old_concept_result|
      concept_result = ConceptResult.find_or_create_from_old_concept_result(old_concept_result)
      unless concept_result&.id
        SaveActivitySessionConceptResultsWorker.perform_async([old_concept_result.id])
        ErrorNotifier.report(ConceptResultCopyFailedException.new("Failed to copy OldConceptResult #{old_concept_result.id}.  Retrying."))
      end
    end
  end
end
