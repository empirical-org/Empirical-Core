FactoryBot.define do
  factory :topic do
    sequence(:name) { |i| "Topic #{i}" }
    level           { 3 }
    visible         { "true" }
    parent_id       { nil }
  end
end
