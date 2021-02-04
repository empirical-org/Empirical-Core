module Comprehension
  class RegexCheck

    ALL_CORRECT_FEEDBACK = 'All regex checks passed.'
    attr_reader :entry, :prompt_id

    def initialize(entry, prompt_id)
      @entry = entry
      @prompt_id = prompt_id
    end

    def optimal?
      matched_rule.blank?
    end

    def feedback
      matched_rule&.feedbacks&.first&.text || ALL_CORRECT_FEEDBACK
    end

    private def matched_rule
      @matched_rule ||= get_matching_rule
    end

    private def get_matching_rule
      rules = Prompt.find(@prompt_id).rules.where(rule_type: Rule::TYPE_REGEX).order_by(:suborder)
      rules.all? { |rule| rule.regex_is_passing?(@entry) }
    end
  end
end
