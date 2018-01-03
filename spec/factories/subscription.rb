FactoryBot.define do
  factory :subscription do
    user_id       { create(:user).id }
    account_limit 1000
    expiration    { Faker::Date.forward(30) }
    account_type  'Teacher Trial'
  end
end
