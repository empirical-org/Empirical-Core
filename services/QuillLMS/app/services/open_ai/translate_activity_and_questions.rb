# frozen_string_literal: true

module OpenAI
  class TranslateActivityAndQuestions < ApplicationService

    attr_reader :activity
    def initialize(activity)
      @activity = activity
    end

    def run
      activity.translate!
      activity.questions.each(&:translate!)
    end
  end
end
