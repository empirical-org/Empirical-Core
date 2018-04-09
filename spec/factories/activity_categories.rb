FactoryBot.define do
  factory :activity_category do
    sequence(:name) { |n| "#{Faker::Book.title} #{n}" }
    sequence(:order_number)
  end
end
