FactoryBot.define do
  factory :evidence_turking_round_activity_session, class: 'Evidence::TurkingRoundActivitySession' do
    association :turking_round, factory: :evidence_turking_round
    activity_session_uid { SecureRandom.uuid }
  end
end
