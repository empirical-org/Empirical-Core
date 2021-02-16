module Comprehension
  class RegexCheck

    ALL_CORRECT_FEEDBACK = 'All regex checks passed.'
    OPTIMAL_RULE_UID = Comprehension::Rule.find_by(optimal: true, rule_type: Rule::TYPE_REGEX)&.uid
    attr_reader :entry, :prompt

    def initialize(entry, prompt)
      @entry = entry
      @prompt = prompt
    end

    def feedback_object
      {
        feedback: feedback,
        feedback_type: Rule::TYPE_REGEX,
        optimal: matched_rule.blank?,
        response_id: '',
        entry: @entry,
        concept_uid: matched_rule&.concept_uid || '',
        rule_uid: matched_rule&.uid || OPTIMAL_RULE_UID,
        highlight: []
      }
    end

    private def feedback
      return ALL_CORRECT_FEEDBACK unless matched_rule
      matched_rule&.feedbacks&.first&.text
    end

    private def matched_rule
      @matched_rule ||= first_failing_regex_rule
    end

    private def first_failing_regex_rule
      rules = @prompt.rules.where(rule_type: Rule::TYPE_REGEX).order(:suborder)
      rules.each do |rule|
        return rule unless rule.regex_is_passing?(@entry)
      end
      nil
    end
  end
end
