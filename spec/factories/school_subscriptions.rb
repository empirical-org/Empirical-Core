FactoryGirl.define do
  factory :school_subscription do
    school_id School.create().id
    subscription_id 1
  end
end
