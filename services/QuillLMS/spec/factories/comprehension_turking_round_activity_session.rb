FactoryBot.define do
  factory :comprehension_turking_round_activity_session, class: 'Evidence::TurkingRoundActivitySession' do
    sequence(:turking_round_id) { |i| i }
    activity_session_uid { SecureRandom.uuid }
  end
end
