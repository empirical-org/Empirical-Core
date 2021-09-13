FactoryBot.define do
  factory :evidence_feedback, class: 'Evidence::Feedback' do
    association :rule, factory: :evidence_rule
    text { "Here is some test feedback." }
    description { "Test description for test feedback record." }
    sequence(:order)
  end
end
