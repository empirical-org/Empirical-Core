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
<<<<<<< HEAD
            concept_uid: 'temp-uid'
          )
          rule.prompts << rule_set.prompts
=======
            prompts: rule_set.prompts
          )
>>>>>>> 8bfb6b2e9da3c4674eda62389cd1b6332283b046
          Feedback.create!(rule: rule, text: rule_set.feedback, order: rule_set.priority)
          rule_set.regex_rules.each do |regex_rule|
            regex_rule.update!(rule_id: rule.id)
          end
        end
      end
    end
  end
end
