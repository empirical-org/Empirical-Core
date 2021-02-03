FactoryBot.define do
  factory :comprehension_rule_set, class: 'Comprehension::RuleSet' do
    association :activity, factory: :comprehension_activity
    name { "Test Regex Rule" }
    feedback { "Here is some example regex feedback" }
    priority { 1 }
  end
end
