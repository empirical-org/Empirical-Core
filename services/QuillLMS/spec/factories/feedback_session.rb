FactoryBot.define do
  factory :feedback_session, class: 'FeedbackSession' do
    uid { SecureRandom.uuid }
    activity_session_uid { 1 }
  end
end
