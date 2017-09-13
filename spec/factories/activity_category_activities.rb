FactoryGirl.define do
  factory :activity_category_activity do

    order_number 0
    activity_category { ActivityCategory.first || FactoryGirl.create(:activity_category) }
    activity { Activity.first || FactoryGirl.create(:activity) }

  end
end
