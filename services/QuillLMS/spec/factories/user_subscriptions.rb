FactoryBot.define do
  factory :user_subscription do
    user_id          { create(:user).id }
    subscription_id  { create(:subscription).id }
  end
end
