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

    def self.get_feedback(entry, prompt, previous_feedback, feedback_types=nil)
      normalized_entry = StringNormalizer.new(entry).run

      triggered_check = find_triggered_check(normalized_entry, prompt, previous_feedback, feedback_types)

      triggered_check || fallback_feedback
    end

    # returns first nonoptimal feedback, and if all are optimal, returns automl feedback
    def self.find_triggered_check(entry, prompt, previous_feedback, feedback_types=nil)
      auto_ml_check = nil

      checks_to_run(feedback_types).reduce(nil) do |response, check_to_run|
        check = check_to_run.run(entry, prompt, previous_feedback)

        next response unless check.success?

        break check&.response unless check.optimal?

        auto_ml_check = check&.response if check.auto_ml?

        auto_ml_check
      end
    rescue => e
      Evidence.error_notifier.report(e)

      fallback_feedback(e.message)
    end

    def self.fallback_feedback(debug=nil)
      @error_rule ||= Rule.find_by(rule_type: Rule::TYPE_ERROR)
      feedback = {
        feedback: @error_rule.feedbacks.first&.text || FALLBACK_RESPONSE[:feedback],
        feedback_type: @error_rule.rule_type,
        optimal: @error_rule.optimal,
      }

      return feedback.merge({debug: debug}) if debug

      feedback
    rescue => e
      Evidence.error_notifier.report(e)

      return FALLBACK_RESPONSE.merge({debug: debug}) if debug

      FALLBACK_RESPONSE
    end

    def self.checks_to_run(feedback_types)
      return ALL_CHECKS if feedback_types.nil? || feedback_types.empty?

      qualified_feedback_types = feedback_types.map { |t| "Evidence::Check::#{t}" }
      filtered_checks = ALL_CHECKS.select { |check| qualified_feedback_types.include?(check.name) }

      raise NoMatchedFeedbackTypesError, "None of the specified feedback_types (#{feedback_types}) were valid." if filtered_checks.empty?

      filtered_checks
    end
  end
end
