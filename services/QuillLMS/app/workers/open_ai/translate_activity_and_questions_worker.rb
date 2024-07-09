# frozen_string_literal: true

require_dependency '../../services/concerns/open_ai/api'

module OpenAI
  class TranslateActivityAndQuestionsWorker
    include Sidekiq::Worker

    sidekiq_options queue: SidekiqQueue::LOW

    def perform(activity_id)
      activity = Activity.find(activity_id)
      TranslateActivityAndQuestions.run(activity)
    rescue ActiveRecord::RecordNotFound
    end
  end
end
