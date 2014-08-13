FactoryGirl.define do

  factory :activity do
    sequence(:name) { |i| "activity #{i}" }
    classification
    description
    topic { Topic.first || create(:topic) }
  end

end
