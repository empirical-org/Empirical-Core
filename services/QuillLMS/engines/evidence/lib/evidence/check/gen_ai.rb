# frozen_string_literal: true

module Evidence
  module Check
    class GenAI < Check::Base
      FEEDBACK_API = Evidence::Gemini::Chat
      REPEAT_API = Evidence::OpenAI::Chat
      SECONDARY_API = Evidence::OpenAI::Chat

      KEY_FEEDBACK = 'feedback'
      KEY_ENTRY = 'entry'

      def run
        with_logging
        @response = Evidence::GenAI::ResponseBuilder.run(primary_response:, secondary_response:, entry:, prompt:)
      end

      def use_for_optimal_feedback? = true

      private def current_entry = entry

      private def primary_feedback = primary_response[Evidence::GenAI::ResponseBuilder::KEY_FEEDBACK]
      private def primary_optimal = primary_response[Evidence::GenAI::ResponseBuilder::KEY_OPTIMAL]

      private def primary_response
        @primary_response ||= FEEDBACK_API.run(system_prompt: primary_feedback_prompt, history:, entry:)
      end

      private def primary_feedback_prompt
        Evidence::GenAI::PrimaryFeedback::StaticPromptBuilder.run(prompt.id) || Evidence::GenAI::PrimaryFeedback::PromptBuilder.run(prompt:)
      end

      private def secondary_response = repeated_feedback? ? secondary_feedback_response : {}

      private def repeated_feedback?
        Evidence::GenAI::RepeatedFeedback::Checker.run(feedback: primary_feedback, history: history_feedback_only, optimal: primary_optimal, chat_api: REPEAT_API)
      end

      private def secondary_feedback_response
        @secondary_feedback_response ||= SECONDARY_API.run(system_prompt: secondary_feedback_prompt, entry: primary_feedback, model: SECONDARY_API::SMALL_MODEL)
      end

      private def secondary_feedback_prompt = Evidence::GenAI::SecondaryFeedback::PromptBuilder.run(prompt:)

      private def history
        previous_feedback.map do |feedback|
          Evidence::GenAI::HistoryItem.new(
            user: feedback[KEY_ENTRY]&.gsub(prompt.text, '')&.strip,
            assistant: feedback[KEY_FEEDBACK]
          )
        end
      end

      private def history_feedback_only = previous_feedback.map { |f| f[KEY_FEEDBACK] }

      private def with_logging
        Rails.logger.info '-------------------------'
        Rails.logger.info 'Previous Feedback'
        Rails.logger.info history
        Rails.logger.info history_feedback_only
        Rails.logger.info '-------------------------'
        Rails.logger.info 'Primary Response'
        Rails.logger.info primary_response
        Rails.logger.info '-------------------------'
        Rails.logger.info 'Secondary Response'
        Rails.logger.info secondary_response
        Rails.logger.info '-------------------------'
      end
    end
  end
end
