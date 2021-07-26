FactoryBot.define do
  factory :comprehension_feedback, class: 'Comprehension::Feedback' do
    association :rule, factory: :comprehension_rule
    text { "Here is some test feedback." }
    description { "Test description for test feedback record." }
    sequence(:order)
  end
end
