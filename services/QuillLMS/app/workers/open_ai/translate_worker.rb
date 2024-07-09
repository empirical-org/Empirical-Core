# frozen_string_literal: true
require_dependency '../../services/concerns/open_ai/api'

module OpenAI
  class TranslateWorker
    include Sidekiq::Worker

    sidekiq_options queue: SidekiqQueue::LOW

    def perform(translatable_id, translatable_type)
      case translatable_type
      when 'Activity'
        translatable = Activity.find(translatable_id)
      when 'Question'
        translatable = Question.find(translatable_id)
      when 'ConceptFeedback'
        translatable = ConceptFeedback.find(translatable_id)
      end
      translatable&.translate!
    rescue ActiveRecord::RecordNotFound
      puts "record not found"
    end
  end
end
