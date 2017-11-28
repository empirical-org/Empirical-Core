FactoryBot.define do
  factory :school_subscription do
    school_id { School.first&.id || FactoryBot.create(:school).id }
    subscription_id 1
  end
end
