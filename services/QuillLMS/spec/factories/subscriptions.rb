# frozen_string_literal: true

FactoryBot.define do
  factory :subscription do
    expiration { (Date.today + 15) }
    start_date { (Date.today - 15) }
    account_type 'Teacher Trial'
    purchaser_id nil
    payment_method ''

    trait(:recurring) { recurring true }
    trait(:non_recurring) { recurring true }
  end
end
