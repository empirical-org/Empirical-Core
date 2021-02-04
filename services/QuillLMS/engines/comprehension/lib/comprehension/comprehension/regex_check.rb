module Comprehension
  class RegexCheck

    ALL_CORRECT_FEEDBACK = 'All regex checks passed.'
    attr_reader :entry, :prompt

    def initialize(entry, prompt)
      @entry = entry
      @prompt = prompt
    end

    def optimal?
      matched_rule.blank?
    end

    def feedback
      return ALL_CORRECT_FEEDBACK unless matched_rule
      matched_rule&.feedbacks&.first&.text  
    end

    private def matched_rule
      @matched_rule ||= get_matching_rule
    end

    private def get_matching_rule
      rules = @prompt.rules.where(rule_type: Rule::TYPE_REGEX).order(:suborder)
      rules.each do |rule| 
        return rule unless rule.regex_is_passing?(@entry)
      end
      nil
    end
  end
end
