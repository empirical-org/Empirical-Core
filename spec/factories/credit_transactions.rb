FactoryBot.define do
  factory :credit_transaction do
    user
    amount { Faker::Number.digit }
  end
end
