FactoryBot.define do
  factory :activity_category do
    sequence(:name) { |n| "Book Title #{n}" }
    sequence(:order_number)
  end
end
