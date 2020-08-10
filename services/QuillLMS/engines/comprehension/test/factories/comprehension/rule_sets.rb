FactoryBot.define do
  factory :comprehension_rule_set, class: 'Comprehension::RuleSet' do
    association :activity, factory: :comprehension_activity
    name { "MyString" }
    feedback { "MyString" }
    priority { 1 }
  end
end
