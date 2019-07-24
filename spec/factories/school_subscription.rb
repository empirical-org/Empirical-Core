FactoryBot.define do
  factory :school_subscription do
    school_id         { create(:school).id }
    subscription_id   { create(:subscription).id }
  end
end
