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

    def self.run(entry, prompt, previous_feedback)
      auto_ml_feedback = nil
      nonoptimal_feedback = nil

      ALL_CHECKS.each do |check|
        feedback = check.run(entry, prompt, previous_feedback)

        next unless feedback.success?

        auto_ml_feedback = feedback if feedback.auto_ml?

        next if feedback.optimal?

        nonoptimal_feedback = feedback

        break
      end

      nonoptimal_feedback || auto_ml_feedback
    end

  end
end
