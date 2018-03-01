FactoryBot.define do
  factory :subscription do
    account_limit 1000
    expiration    { Faker::Date.forward(30) }
    start_date {Faker::Date.backward(30)}
    account_type  'Teacher Trial'
  end
end
