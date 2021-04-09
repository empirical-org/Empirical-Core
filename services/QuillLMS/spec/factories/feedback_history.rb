FactoryBot.define do
  factory :feedback_history, class: 'FeedbackHistory' do
    activity_session_uid { SecureRandom.uuid }
    concept_uid { SecureRandom.uuid.slice(0, 22) }
    attempt { 1 }
    entry { "This is what the student submitted." }
    feedback_text { "This is the feedback the student got." }
    feedback_type { "autoML" }
    optimal { true }
    used { true }
    time { DateTime.now }
    metadata { {foo: 'bar'} }
    rule_uid { SecureRandom.uuid }
  end
end
