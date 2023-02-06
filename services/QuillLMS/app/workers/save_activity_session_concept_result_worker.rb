# frozen_string_literal: true

class SaveActivitySessionConceptResultWorker
  include Sidekiq::Worker

  sidekiq_options queue: SidekiqQueue::CRITICAL

  def perform(json_payload)
    concept_result = ConceptResult.init_from_json(json_payload)
    concept_result.save!
  end
end
