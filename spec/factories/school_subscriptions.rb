FactoryGirl.define do
  factory :school_subscription do
    school_id School.first || FactoryGirl.create(:school)
    subscription_id 1
  end
end
