FactoryBot.define do
  factory :unit do
    sequence(:name) { |i| "Unit #{i}" }
  end
end
