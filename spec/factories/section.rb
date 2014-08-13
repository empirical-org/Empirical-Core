FactoryGirl.define do

  factory :section do
    sequence(:name) { |i| "section #{i}" }
    position 1
  end

end
