FactoryBot.define do
  factory :credit_transaction do
    user
    amount { 1 }
  end
end
