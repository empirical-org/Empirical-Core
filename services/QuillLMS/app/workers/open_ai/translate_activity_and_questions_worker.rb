# frozen_string_literal: true

require_dependency '../../services/concerns/open_ai/api'

module OpenAI
  class TranslateActivityAndQuestionsWorker
    include Sidekiq::Worker

    sidekiq_options queue: SidekiqQueue::LOW

    def perform(activity_id)
      activity = Activity.find_by(id: activity_id)
      return unless activity.present?

      TranslateActivityAndQuestions.run(activity)
    end
  end
end
