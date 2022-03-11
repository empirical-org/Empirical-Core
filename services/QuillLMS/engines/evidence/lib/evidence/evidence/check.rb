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

    # returns first nonoptimal feedback, and if all are optimal, returns automl feedback
    def self.run_all(entry, prompt, previous_feedback)
      auto_ml_response = nil
      nonoptimal_response = nil

      ALL_CHECKS.each do |check|
        response = check.run(entry, prompt, previous_feedback)

        next unless response.success?

        auto_ml_response = response if response.auto_ml?

        next if response.optimal?

        nonoptimal_response = response

        break
      end

      nonoptimal_response || auto_ml_response
    end

  end
end
