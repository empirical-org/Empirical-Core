# frozen_string_literal: true

module Evidence
  module Check
    class GenAI < Check::Base
      KEY_REPEAT = 'repeat_feedback'

      def run
        system_prompt = Evidence::GenAI::SystemPromptBuilder.run(prompt:)

        primary_response = Evidence::OpenAI::Chat.run(system_prompt:, history:, entry:)
        primary_feedback = primary_response[Evidence::GenAI::ResponseBuilder::KEY_FEEDBACK]

        secondary_response = needs_secondary_feedback?(primary_feedback) ? secondary_feedback_response(primary_feedback) : {}

        @response = Evidence::GenAI::ResponseBuilder.run(primary_response:, secondary_response:, entry:, prompt:)
      end

      def needs_secondary_feedback?(feedback)
        return false unless feedback_history.size.in?([1,2,3]) # No secondary feedback on 1st or 5th entry

        !!needs_secondary_response(feedback)[KEY_REPEAT]
      end

      def secondary_feedback_response(feedback)
        Evidence::OpenAI::Chat.run(system_prompt: secondary_feedback_prompt, entry: feedback, model: 'gpt-4o-mini')
      end

      def needs_secondary_response(feedback)
        Evidence::OpenAI::Chat.run(system_prompt: repeated_feedback_prompt, entry: feedback, model: 'gpt-4o-mini')
      end

      def use_for_optimal_feedback? = true

      private def current_entry = entry

      private def secondary_feedback_prompt = Evidence::GenAI::SecondaryFeedbackPromptBuilder.run(prompt:)
      private def repeated_feedback_prompt = Evidence::GenAI::RepeatedFeedbackPromptBuilder.run(prompt:, history: feedback_history)

      private def feedback_history
        previous_feedback
          .map { |f| Evidence::OpenAI::Chat::HistoryItem.new(user: 'unused', assistant: f['feedback']) }
      end

      # TODO: This is a relative inefficient query. We'd likely want to update the Feedback#create API
      # to save the user entry and feedback history (instead of just feedback history)
      private def history
        return [] if session.nil?
        @history ||= session
          .history_texts
          .map { |fh| Evidence::OpenAI::Chat::HistoryItem.new(user: fh.entry, assistant: fh.feedback_text) }
      end

      private def session
        @session ||= Evidence.feedback_session_class.find_by(activity_session_uid: session_uid)
      end
    end
  end
end
