FactoryBot.define do
  factory :topic_category do
    sequence(:name) { |i| "Topic Category #{i}" }
  end
end
