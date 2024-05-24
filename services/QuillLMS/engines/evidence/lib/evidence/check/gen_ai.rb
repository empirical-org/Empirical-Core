# frozen_string_literal: true

module Evidence
  module Check
    class GenAI < Check::Base
      HistoryItem = Struct.new(:entry, :feedback, keyword_init: true)

      def run
        system_prompt = Evidence::GenAI::SystemPromptBuilder.run(prompt: prompt)

        chat = Evidence::OpenAI::ChatWithHistory.new(
          system_prompt:,
          current_entry:,
          history:
        )

        @response = Evidence::GenAI::ResponseBuilder.run(chat:, entry:, conjunction:)
      end

      def use_for_optimal_feedback? = true

      private def current_entry = entry
      private def conjunction = prompt.conjunction

      private def history
        session = Evidence.feedback_session_class.find_by(activity_session_uid: session_uid)

        return [] unless session

        session
          .feedback_history
          .select(:entry,:feedback_text)
          .order(attempt: :asc)
          .map {|fh| HistoryItem.new(entry: fh.entry, feedback: fh.feedback_text) }
      end
    end
  end
end
