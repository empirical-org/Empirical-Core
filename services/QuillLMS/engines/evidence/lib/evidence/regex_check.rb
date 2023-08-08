# frozen_string_literal: true

module Evidence
  class RegexCheck

    ALL_CORRECT_FEEDBACK = '<p>All regex checks passed.</p>'
    OPTIMAL_RULE_KEY = 'optimal_regex_rule_uid'
    attr_reader :entry, :prompt, :rule_type

    def initialize(entry, prompt, rule_type)
      @entry = entry
      @prompt = prompt
      @rule_type = rule_type
    end

    def feedback_object
      {
        feedback: feedback_text,
        feedback_type: @rule_type,
        optimal: matched_rule.blank?,
        entry: @entry,
        concept_uid: matched_rule&.concept_uid || '',
        rule_uid: matched_rule&.uid || optimal_rule_uid,
        hint: matched_rule&.hint,
        highlight: highlights
      }
    end

    private def optimal_rule_uid
      cached = $redis.get(OPTIMAL_RULE_KEY)
      optimal_rule_uid = cached.nil? || cached&.blank? ? nil : cached
      unless optimal_rule_uid
        optimal_rule_uid = Evidence::Rule.find_by(optimal: true, rule_type: @rule_type)&.uid
        $redis.set(OPTIMAL_RULE_KEY, optimal_rule_uid)
      end
      optimal_rule_uid || ''
    end

    private def feedback
      matched_rule&.feedbacks&.first
    end

    private def feedback_text
      return ALL_CORRECT_FEEDBACK unless matched_rule

      feedback&.text
    end

    private def matched_rule
      @matched_rule ||= first_failing_regex_rule
    end

    private def highlights
      return [] unless feedback&.highlights

      feedback&.highlights&.map do |h|
        {
          type: h.highlight_type,
          text: h.text,
          category: ''
        }
      end
    end

    private def first_failing_regex_rule
      rules = @prompt.rules
        .where(rule_type: @rule_type)
        .includes(:required_sequences, :incorrect_sequences)
        .order(:suborder)

      rules.find {|rule| !rule.regex_is_passing?(@entry) }
    end
  end
end
