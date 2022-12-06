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
    concept_result = ConceptResult.init_from_json(json_payload)
    concept_result.save!
  end
end
