FactoryBot.define do
  factory :feedback_session, class: 'FeedbackSession' do
    activity_session_uid { SecureRandom.uuid }
    uid { SecureRandom.uuid }
  end
end
