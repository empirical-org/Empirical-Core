FactoryBot.define do
  factory :topic do
    sequence(:name) { |i| "topic #{i}" }
    section         { Section      .first || FactoryBot.create(:section) }
    topic_category  { TopicCategory.first || FactoryBot.create(:topic_category) }
  end
end
