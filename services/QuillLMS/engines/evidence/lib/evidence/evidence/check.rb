# frozen_string_literal: true

module Evidence
  module Check
    ALL_CHECKS = [
      Prefilter,
      RegexSentence,
      Opinion,
      Plagiarism,
      AutoML,
      RegexPostTopic,
      Grammar,
      Spelling,
      RegexTypo
    ]

    FALLBACK_RESPONSE = {
      feedback: "Thank you for your response.",
      feedback_type: "autoML",
      optimal: true,
    }

    def self.feedback(entry, prompt, previous_feedback)
      triggered_check = find_triggered_check(entry, prompt, previous_feedback)

      triggered_check&.response || FALLBACK_RESPONSE
    end

    # returns first nonoptimal feedback, and if all are optimal, returns automl feedback
    def self.find_triggered_check(entry, prompt, previous_feedback)
      auto_ml_check = nil
      first_nonoptimal_check = nil

      ALL_CHECKS.each do |check_to_run|
        check = check_to_run.run(entry, prompt, previous_feedback)

        next unless check.success?

        auto_ml_check = check if check.auto_ml?

        next if check.optimal?

        first_nonoptimal_check = check

        break
      end

      first_nonoptimal_check || auto_ml_check
    end

  end
end
