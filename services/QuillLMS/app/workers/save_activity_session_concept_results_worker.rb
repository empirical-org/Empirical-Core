# frozen_string_literal: true

class SaveActivitySessionConceptResultsWorker
  include Sidekiq::Worker

  class ConceptResultCopyFailedException < StandardError; end

  def perform(json_payload)
    # TODO: When we stop writing OldConceptResult records, update this to
    # just save new ConceptResult records from JSON data, and skip the transaction
    ActiveRecord::Base.transaction do
      old_concept_result = OldConceptResult.create!(json_payload)
      concept_result = ConceptResult.init_from_json(json_payload)
      concept_result.old_concept_result_id = old_concept_result.id
      concept_result.save!
    end
  end
end
