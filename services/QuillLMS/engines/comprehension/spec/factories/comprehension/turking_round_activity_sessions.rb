FactoryBot.define do
  factory :comprehension_turking_round_activity_session, class: 'Comprehension::TurkingRoundActivitySession' do
    association :turking_round, factory: :comprehension_turking_round
    activity_session_uid { SecureRandom.uuid }
  end
end
