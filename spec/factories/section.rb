FactoryGirl.define do

  factory :section do
    sequence(:name) { |i| "section #{i}" }
    sequence(:position) { |i| i }
  end

end
