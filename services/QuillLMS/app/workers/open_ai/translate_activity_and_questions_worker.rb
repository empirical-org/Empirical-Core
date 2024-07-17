# frozen_string_literal: true


module OpenAI
  class TranslateActivityAndQuestionsWorker
    include Sidekiq::Worker

    sidekiq_options queue: SidekiqQueue::LOW

    def perform(activity_id)
      activity = Activity.find_by(id: activity_id)
      return unless activity.present?

      activity.translate!
      activity.questions.each(&:translate!)
    end
  end
end
