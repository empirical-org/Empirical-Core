FactoryBot.define do
  factory :activity_category_activity do

    order_number 0
    activity_category { ActivityCategory.first || FactoryBot.create(:activity_category) }
    activity { Activity.first || FactoryBot.create(:activity) }

  end
end
