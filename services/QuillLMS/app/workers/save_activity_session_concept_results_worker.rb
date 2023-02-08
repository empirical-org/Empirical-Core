# frozen_string_literal: true

class SaveActivitySessionConceptResultsWorker
  include Sidekiq::Worker

  sidekiq_options queue: SidekiqQueue::CRITICAL

  class ConceptResultCopyFailedException < StandardError; end

  def perform(json_payload)
    ConceptResult
      .init_from_json(json_payload)
      .save!
  end
end
