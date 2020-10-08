FactoryBot.define do
  factory :standard_category do
    sequence(:name) { |i| "Standard Category #{i}" }
  end
end
