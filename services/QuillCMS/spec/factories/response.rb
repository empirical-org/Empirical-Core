FactoryBot.define do
  factory :response, class: 'Response' do
    feedback 'Sample feedback'
    question_uid SecureRandom.uuid
    sequence(:text) { |n| 'I am text #{n}' }
  end
end
