# frozen_string_literal: true

module Evidence
  module GenAI
    class RepeatedFeedbackChecker < ApplicationService
      KEY_REPEAT = 'repeat_feedback'
      MODEL = 'gpt-4o-mini'

      attr_reader :feedback, :history, :optimal

      def initialize(feedback:, history: [], optimal: false)
        @feedback = feedback
        @history = history
        @optimal = optimal
      end

      def run
        return false if optimal
        return false if history.empty? # can't be repeat with no history
        return false if history.size >= 4 # No secondary feedback on last attempt

        !!llm_response[KEY_REPEAT]
      end

      private def system_prompt = Evidence::GenAI::RepeatedFeedbackPromptBuilder.run(prompt: nil, history:)

      private def llm_response = Evidence::OpenAI::Chat.run(system_prompt:, entry: feedback, model: MODEL)
    end
  end
end
