FactoryBot.define do
  factory :standard do
    sequence(:name) { |n| "Standard #{n}" }
    standard_level { create(:standard_level) }
    standard_category { StandardCategory.first || create(:standard_category) }

    trait :with_change_log do
      after(:create) do |t|
        create(:change_log, changed_record: t)
      end
    end

  end
end
