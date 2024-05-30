# frozen_string_literal: true

module Evidence
  module Check
    class GenAI < Check::Base
      def run
        system_prompt = Evidence::GenAI::SystemPromptBuilder.run(prompt:, history:)

        chat_response = Evidence::OpenAI::Chat.run(system_prompt:, history:, entry:)

        @response = Evidence::GenAI::ResponseBuilder.run(chat_response:, entry:, prompt:)
      end

      def use_for_optimal_feedback? = true

      private def current_entry = entry

      private def history
        session = Evidence.feedback_session_class.find_by(activity_session_uid: session_uid)

        return [] unless session

        session
          .feedback_history
          .select(:entry,:feedback_text)
          .order(attempt: :asc)
          .map {|fh| Evidence::OpenAI::Chat::HistoryItem.new(user: fh.entry, assistant: fh.feedback_text) }
      end
    end
  end
end
