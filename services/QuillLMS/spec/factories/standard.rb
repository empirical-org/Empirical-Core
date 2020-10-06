FactoryBot.define do
  factory :standard do
    sequence(:name) { |n| "Standard #{n}" }
    standard_level { create(:standard_level) }
    standard_category { StandardCategory.first || create(:standard_category) }
  end
end
