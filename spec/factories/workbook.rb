FactoryGirl.define do
  factory :workbook do
    sequence(:title) { |i| "workbook #{i}" }
  end
end
