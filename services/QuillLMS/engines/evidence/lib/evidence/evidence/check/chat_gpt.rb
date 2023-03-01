# frozen_string_literal: true

module Evidence
  class Check::ChatGPT < Check::Base
    RULE_TYPE = 'chatGPT'

    def run
      chat = Evidence::OpenAI::Chat.new(
        source: plagiarism_text,
        prompt: prompt.text,
        entry: entry,
        history: history
      )

      feedback = chat.run

      @response = {
        feedback: feedback,
        feedback_type: RULE_TYPE,
        optimal: chat.optimal?,
        entry: entry,
        concept_uid: '',
        rule_uid: '',
        hint: nil
      }
    end

    private def plagiarism_text
      plagiarism_rule = prompt.rules&.find_by(rule_type: Evidence::Rule::TYPE_PLAGIARISM)


      plagiarism_rule&.plagiarism_texts&.first&.text || ""
    end

    private def history
      session = Evidence.feedback_session_class.find_by(activity_session_uid: session_uid)

      return [] unless session

      session
        .feedback_history
        .select(:entry,:feedback_text)
        .order(attempt: :asc)
    end

    def auto_ml?
      true
    end
  end
end
