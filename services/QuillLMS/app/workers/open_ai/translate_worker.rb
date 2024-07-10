# frozen_string_literal: true

require_dependency '../../services/concerns/open_ai/api'

module OpenAI
  class TranslateWorker
    include Sidekiq::Worker

    sidekiq_options queue: SidekiqQueue::LOW
    TRANSLATABLE_TYPES = {
      'Activity' => Activity,
      'Question' => Question,
      'ConceptFeedback' => ConceptFeedback
    }.freeze
    def perform(translatable_id, translatable_type)
      TRANSLATABLE_TYPES[translatable_type]
      &.find_by(id: translatable_id)
      &.translate!
    end
  end
end
