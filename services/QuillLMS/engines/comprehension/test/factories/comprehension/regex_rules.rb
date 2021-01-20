FactoryBot.define do
  factory :comprehension_regex_rule, class: 'Comprehension::RegexRule' do
    association :rule_set, factory: :comprehension_rule_set
    regex_text { "MyString" }
    case_sensitive { false }
  end
end
