FactoryBot.define do
  factory :comprehension_turking_round, class: 'Comprehension::TurkingRound' do
    association :activity, factory: :comprehension_activity
    expires_at { "2020-06-30 12:13:47" }
  end
end
