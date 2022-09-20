# frozen_string_literal: true

class SaveActivitySessionConceptResultsWorker
  include Sidekiq::Worker

  class ConceptResultCopyFailedException < StandardError; end

  def perform(json_payload)
    ActiveRecord::Base.transaction do
      if json_payload.is_a?(Array)
        json_payload.each { |payload| create_records(payload) }
      else
        create_records(json_payload) unless json_payload.is_a?(Array)
      end
    end
  end

  private def create_records(json_payload)
    return if json_payload['question_type'] == 'lessons-slide' && json_payload['activity_session_id'].nil?
    # TODO: When we stop writing OldConceptResult records, update this to
    # just save new ConceptResult records from JSON data, and skip the transaction
    old_concept_result = OldConceptResult.create!(json_payload)
    concept_result = ConceptResult.init_from_json(json_payload)
    concept_result.old_concept_result_id = old_concept_result.id
    concept_result.save!
  end
end
