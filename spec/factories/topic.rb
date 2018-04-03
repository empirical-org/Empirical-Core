FactoryBot.define do
  factory :topic do
    sequence(:name) { Faker::Lorem.words(3).join(' ') }
    section         { create(:section) }
    topic_category  { create(:topic_category) }
  end
end
