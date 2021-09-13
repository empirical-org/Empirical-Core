FactoryBot.define do
  factory :evidence_turking_round, class: 'Evidence::TurkingRound' do
    association :activity, factory: :evidence_activity
    expires_at { 1.month.from_now }
    uuid { SecureRandom.uuid }
  end
end
