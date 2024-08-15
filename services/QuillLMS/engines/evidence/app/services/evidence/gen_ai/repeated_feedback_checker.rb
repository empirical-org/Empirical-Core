# frozen_string_literal: true

module Evidence
  module GenAI
    class RepeatedFeedbackChecker < ApplicationService
      KEY_REPEAT = 'repeat_feedback'

      attr_reader :feedback, :history, :optimal, :chat_api

      def initialize(feedback:, history: [], optimal: false, chat_api: Evidence::OpenAI::Chat)
        @feedback = feedback
        @history = history
        @optimal = optimal
        @chat_api = chat_api
      end

      def run
        return false if optimal
        return false if history.empty? # can't be repeat with no history
        return false if history.size >= 4 # No secondary feedback on last attempt

        !!llm_response[KEY_REPEAT]
      end

      private def system_prompt = Evidence::GenAI::RepeatedFeedbackPromptBuilder.run(prompt: nil, history:)

      private def llm_response = chat_api.run(system_prompt:, entry: feedback, model: chat_api::SMALL_MODEL)
    end
  end
end
