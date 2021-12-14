FactoryBot.define do
  factory :response, class: 'Response' do
    feedback 'Sample feedback'
    question_uid SecureRandom.uuid
    sequence(:text) { |n| "I am text #{n}" }

    factory :optimal_response do
      optimal true
    end

    factory :ungraded_response do
      optimal nil
    end

    factory :graded_nonoptimal_response do
      optimal false
    end
  end
end
