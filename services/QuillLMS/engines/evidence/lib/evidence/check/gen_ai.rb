# frozen_string_literal: true

module Evidence
  module Check
    class GenAI < Check::Base
      def run
        @response = Evidence::GenAI::ResponseBuilder.run(primary_response:, secondary_response:, entry:, prompt:)
      end

      def use_for_optimal_feedback? = true

      private def current_entry = entry

      private def primary_feedback = primary_response[Evidence::GenAI::ResponseBuilder::KEY_FEEDBACK]
      private def primary_optimal = primary_response[Evidence::GenAI::ResponseBuilder::KEY_OPTIMAL]

      private def primary_response
        @primary_response ||= Evidence::OpenAI::Chat.run(system_prompt:, history: session_history, entry:)
      end

      private def system_prompt = Evidence::GenAI::SystemPromptBuilder.run(prompt:)

      private def secondary_response = repeated_feedback? ? secondary_feedback_response : {}

      private def repeated_feedback?
        Evidence::GenAI::RepeatedFeedbackChecker.run(feedback: primary_feedback, history: feedback_history, optimal: primary_optimal)
      end

      private def secondary_feedback_response
        @secondary_feedback_response ||= Evidence::OpenAI::Chat.run(system_prompt: secondary_feedback_prompt, entry: primary_feedback, model: 'gpt-4o-mini')
      end

      private def secondary_feedback_prompt = Evidence::GenAI::SecondaryFeedbackPromptBuilder.run(prompt:)

      private def feedback_history
        previous_feedback.map { |f| f['feedback'] }
      end

      # TODO: This is a relative inefficient query. We'd likely want to update the Feedback#create API
      # to save the user entry and feedback history (instead of just feedback history)
      private def session_history
        return [] if session.nil?

        @history ||= session
          .feedback_history
          .sort_by(&:id)
          .map { |fh| Evidence::OpenAI::Chat::HistoryItem.new(user: fh.entry, assistant: fh.feedback_text) }
      end

      private def session
        @session ||= Evidence.feedback_session_class.find_by(activity_session_uid: session_uid)
      end
    end
  end
end
