FactoryBot.define do
  factory :evidence_prompt, class: 'Evidence::Prompt' do
    association :activity, factory: :evidence_activity
    conjunction { "because" }
    text { "my text would go here." }
    max_attempts_feedback { "MyText" }
  end
end
