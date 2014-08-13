FactoryGirl.define do

  factory :topic do
    sequence(:name) { |i| "topic #{i}" }
    section
  end

end
