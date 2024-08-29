# frozen_string_literal: true

module Evidence
  module GenAI
    module RepeatedFeedback
      class Checker < ApplicationService
        KEY_REPEAT = 'repeat_feedback'
        DEFAULT_TEMPERATURE = 0

        attr_reader :feedback, :history, :optimal, :chat_api, :temperature

        def initialize(feedback:, history: [], optimal: false, chat_api: Evidence::OpenAI::Chat, temperature: DEFAULT_TEMPERATURE)
          @feedback = feedback
          @history = history
          @optimal = optimal
          @chat_api = chat_api
          @temperature = temperature
        end

        def run
          # Avoid LLM call in situations that don't use secondary feedback
          return false if optimal || first_attempt? || last_attempt?

          puts system_prompt
          puts history
          puts llm_response

          !!llm_response[KEY_REPEAT]
        end

        private def first_attempt? = history.empty?
        private def last_attempt? = history.size >= 4

        private def system_prompt = Evidence::GenAI::RepeatedFeedback::PromptBuilder.run(prompt: nil, history:)
        private def entry = HTMLTagRemover.run(feedback.chomp)
        private def model = chat_api::SMALL_MODEL

        private def llm_response
          @llm_response ||= chat_api.run(system_prompt:, entry:, model:, temperature:)
        end
      end
    end
  end
end
