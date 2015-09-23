FactoryGirl.define do

  factory :unit_template do
    sequence(:name) {|i| "Unit Template #{i}"}
  end
end