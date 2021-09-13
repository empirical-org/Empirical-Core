FactoryBot.define do
  factory :evidence_regex_rule, class: 'Evidence::RegexRule' do
    association :rule, factory: :evidence_rule
    regex_text { "MyString" }
    case_sensitive { false }
    sequence_type { "incorrect" }
  end
end
