# frozen_string_literal: true

class SaveActivitySessionConceptResultsWorker
  include Sidekiq::Worker

  class ConceptResultCopyFailedException < StandardError; end

  def perform(json_payload)
    ConceptResult.create_from_json(json_payload)
  end
end
