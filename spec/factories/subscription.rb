FactoryBot.define do
  factory :subscription do
    expiration    { Faker::Date.forward(30) }
    start_date {Faker::Date.backward(30)}
    account_type  'Teacher Trial'
    purchaser_id nil
  end
end
