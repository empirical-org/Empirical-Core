# frozen_string_literal: true

class CleanConceptResultInstructionsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::MIGRATION

  def perform(start, stop)
    stop = ConceptResult.maximum(:id) unless stop

    ConceptResult.includes(:concept_result_instructions).where(id: start..stop).find_each do |concept_result|
      return unless concept_result.concept_result_instructions&.text
      return unless concept_result.concept_result_instructions.text == concept_result.extra_metadata['instructions']

      concept_result.update(extra_metadata: concept_result.extra_metadata.except('instructions'))
    end
  end
end
