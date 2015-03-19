FactoryGirl.define do
  factory :topic_category do
    sequence(:name) { |i| "topic category #{i}" }
  end
end

