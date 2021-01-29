module Comprehension
  class PlagiarismCheck
    def self.run
      RuleSet.all.each do |rule_set|
        rule = Rule.find_or_create_by!(prompts: [rule_set.prompt_ids], name: rule_set.name, suborder: rule_set.priority)
        Feedback.find_or_create_by!(rule: rule, text: rule_set.feedback, order: rule_set.priority)
        rule_set.regex_rules.each do |regex_rule|
          regex_rule.rule_id = rule.id
        end
      end
    end
  end
end
