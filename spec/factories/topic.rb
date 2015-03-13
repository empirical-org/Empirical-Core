FactoryGirl.define do
  factory :topic do
    sequence(:name) { |i| "topic #{i}" }
    section         { Section      .first || FactoryGirl.create(:section) }
    topic_category  { TopicCategory.first || FactoryGirl.create(:topic_category) }
  end
end
