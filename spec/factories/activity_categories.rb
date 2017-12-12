FactoryBot.define do
  factory :activity_category do
    name { Faker::Book.title }
    sequence(:order_number)
  end
end
