FactoryBot.define do
  factory :subscription do
    account_limit 1
    expiration Date.today
  end
end