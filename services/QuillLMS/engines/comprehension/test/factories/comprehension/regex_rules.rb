FactoryBot.define do
  factory :comprehension_regex_rule, class: 'Comprehension::RegexRule' do
    association :rule, factory: :comprehension_rule
    regex_text { "MyString" }
    case_sensitive { false }
    sequence_type { "incorrect" }
  end
end
