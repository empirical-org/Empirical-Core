FactoryBot.define do
  factory :comprehension_prompt, class: 'Comprehension::Prompt' do
    association :activity, factory: :comprehension_activity
    conjunction { "because" }
    text { "my text would go here." }
    max_attempts_feedback { "MyText" }
  end
end
