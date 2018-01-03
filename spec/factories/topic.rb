FactoryBot.define do
  factory :topic do
    sequence(:name) { |i| "Topic #{i}" }
    section         { create(:section) }
    topic_category  { create(:topic_category) }
  end
end
