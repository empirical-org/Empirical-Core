FactoryBot.define do
  factory :topic do
    sequence(:name) { |n| "Topic #{n}" }
    section         { create(:section) }
    topic_category  { TopicCategory.first || create(:topic_category) }
  end
end
