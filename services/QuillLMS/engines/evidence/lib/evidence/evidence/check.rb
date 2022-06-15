# frozen_string_literal: true

module Evidence
  module Check
    class NoMatchedFeedbackTypesError < StandardError; end

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
      feedback: "<p>Thank you for your response! Something went wrong on our end and our feedback system doesn’t understand your response. Move on to the next prompt!</p>",
      feedback_type: Rule::TYPE_ERROR,
      optimal: true,
    }

    def self.get_feedback(entry, prompt, previous_feedback, feedback_types)
      triggered_check = find_triggered_check(entry, prompt, previous_feedback, feedback_types)

      triggered_check&.response || fallback_feedback
    end

    # returns first nonoptimal feedback, and if all are optimal, returns automl feedback
    def self.find_triggered_check(entry, prompt, previous_feedback, feedback_types)
      auto_ml_check = nil
      first_nonoptimal_check = nil

      checks_to_run(feedback_types).each do |check_to_run|
        check = check_to_run.run(entry, prompt, previous_feedback)

        next unless check.success?

        auto_ml_check = check if check.auto_ml?

        if !check.optimal?
          first_nonoptimal_check = check
          break
        end
      end

      first_nonoptimal_check || auto_ml_check
    end

    def self.fallback_feedback
      @error_rule ||= Rule.find_by(rule_type: Rule::TYPE_ERROR)
      {
        feedback: @error_rule.feedbacks.first&.text || FALLBACK_RESPONSE[:feedback],
        feedback_type: @error_rule.rule_type,
        optimal: @error_rule.optimal,
      }
    rescue => e
      Evidence.error_notifier.report(e)

      FALLBACK_RESPONSE
    end

    def self.checks_to_run(feedback_types)
      return ALL_CHECKS if feedback_types.nil? || feedback_types.empty?

      qualified_feedback_types = feedback_types.map { |t| "Evidence::Check::#{t}" }
      filtered_checks = ALL_CHECKS.select { |check| qualified_feedback_types.include?(check.name) }

      raise NoMatchedFeedbackTypesError if filtered_checks.empty?

      filtered_checks
    end
  end
end
