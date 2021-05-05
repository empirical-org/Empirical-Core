FactoryBot.define do
  factory :subscription do
    expiration    { (Date.today + 15) }
    start_date { (Date.today - 15) }
    account_type 'Teacher Trial'
    purchaser_id nil
    payment_method ''
  end
end
