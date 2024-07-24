# frozen_string_literal: true

module OpenAI
  class TranslateWorker
    include Sidekiq::Worker

    sidekiq_options queue: SidekiqQueue::LOW
    TRANSLATABLE_TYPES = {
      'Activity' => Activity,
      'Question' => Question,
      'ConceptFeedback' => ConceptFeedback
    }.freeze
    def perform(translatable_id, translatable_type, locale = Translatable::DEFAULT_LOCALE)
      TRANSLATABLE_TYPES[translatable_type]
      &.find_by(id: translatable_id)
      &.translate!(locale:)
    end
  end
end
