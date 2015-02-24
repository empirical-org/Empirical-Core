FactoryGirl.define do

  factory :unit do
    sequence(:name) { |i| "unit #{i}" }
  end
end