FactoryBot.define do
  factory :comprehension_turking_round, class: 'Comprehension::TurkingRound' do
    association :activity, factory: :comprehension_activity
    expires_at { 1.month.from_now }
    uuid { SecureRandom.uuid }
  end
end
