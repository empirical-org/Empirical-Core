FactoryBot.define do
  factory :activity_category_activity do
    sequence(:order_number)
    activity_category { create(:activity_category) }
    activity          { create(:activity) }
  end
end
