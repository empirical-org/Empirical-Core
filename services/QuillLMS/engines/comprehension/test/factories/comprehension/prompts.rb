FactoryBot.define do
  factory :comprehension_prompt, class: 'Comprehension::Prompt' do
    association :activity, factory: :comprehension_activity
    conjunction { "because" }
    text { "my text would go here." }
    max_attempts_feedback { "MyText" }
    plagiarism_text { "do not plagiarize this text please, thank you"}
    plagiarism_first_feedback { "you plagrized!"}
  end
end
