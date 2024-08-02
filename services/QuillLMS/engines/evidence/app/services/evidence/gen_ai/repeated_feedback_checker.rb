# frozen_string_literal: true

module Evidence
  module GenAI
    class RepeatedFeedbackChecker < ApplicationService
      KEY_REPEAT = 'repeat_feedback'

      attr_reader :feedback, :history

      def initialize(feedback:, history: [])
        @feedback = feedback
        @history = history
      end

      def run
        return false unless history.size.in?([1,2,3]) # No secondary feedback on 1st or 5th entry

        !!llm_response[KEY_REPEAT]
      end

      private def system_prompt = Evidence::GenAI::RepeatedFeedbackPromptBuilder.run(prompt: nil, history:)

      def llm_response
        Evidence::OpenAI::Chat.run(system_prompt:, entry: feedback, model: 'gpt-4o-mini')
      end
    end
  end
end
