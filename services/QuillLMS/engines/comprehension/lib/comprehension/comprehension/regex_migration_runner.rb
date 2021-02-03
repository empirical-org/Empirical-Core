module Comprehension
  class RegexMigrationRunner
    def self.run
      ActiveRecord::Base.transaction do
        RuleSet.all.each do |rule_set|
          next unless Comprehension::Rule.where(name: rule_set.name, rule_type: Comprehension::Rule::TYPE_REGEX, suborder: rule_set.priority).joins(:prompts).merge( Comprehension::Prompt.where(id: rule_set.prompt_ids)).empty?
          rule = Rule.create!(
            name: rule_set.name,
            suborder: rule_set.priority,
            universal: false,
            optimal: false,
            rule_type: Rule::TYPE_REGEX,
            prompts: rule_set.prompts
          )
          Feedback.create!(rule: rule, text: rule_set.feedback, order: rule_set.priority)
          rule_set.regex_rules.each do |regex_rule|
            regex_rule.update!(rule_id: rule.id)
          end
        end
      end
    end
  end
end
