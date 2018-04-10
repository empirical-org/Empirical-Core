FactoryBot.define do
  factory :topic do
    sequence(:name) { |n| "#{Faker::Lorem.words(3).join(' ')} #{n}" }
    section         { create(:section) }
    topic_category  { create(:topic_category) }
  end
end
