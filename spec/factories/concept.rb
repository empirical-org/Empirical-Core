FactoryBot.define do
  factory :concept do
    sequence(:name) { |i| "concept #{i}" }
  end
end
