module Comprehension
  class RegexMigrationRunner
    def self.run
      ActiveRecord::Base.transaction do
        RuleSet.all.each do |rule_set|
          rule = Rule.create!(
            name: rule_set.name,
            suborder: rule_set.priority,
            universal: false,
            optimal: false,
            rule_type: Rule::TYPE_REGEX,
            concept_uid: 'temp-uid'
          )
          rule.prompts << rule_set.prompts if rule.prompts != rule_set.prompts
          Feedback.create!(rule: rule, text: rule_set.feedback, order: rule_set.priority)
          rule_set.regex_rules.each do |regex_rule|
            regex_rule.update!(rule_id: rule.id)
          end
        end
      end
    end
  end
end
