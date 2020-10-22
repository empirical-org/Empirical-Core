FactoryBot.define do
  factory :comprehension_feedback_history, class: 'Comprehension::FeedbackHistory' do
    activity_session_uid { SecureRandom.uuid }
    association :prompt, factory: :comprehension_prompt
    concept_uid { SecureRandom.uuid.slice(0, 22) }
    attempt { 1 }
    entry { "This is what the student submitted." }
    feedback_text { "This is the feedback the student got." }
    feedback_type { "semantic" }
    optimal { true }
    used { true }
    time { DateTime.now }
    metadata { {foo: 'bar'} }
  end
end
