FactoryGirl.define do

  factory :classroom do
    sequence(:name) { |i| "classroom #{i}" }
    teacher
    after(:create) {|c| c.units.create_next }
  end

  factory :section do
    sequence(:name) { |i| "section #{i}" }
    position 1
  end

  factory :topic do
    sequence(:name) { |i| "topic #{i}" }
    section
  end

  factory :activity_classification, aliases: [:classification] do
    sequence(:name) { |i| "activity cls #{i}" }
    key
  end

  factory :activity do
    sequence(:name) { |i| "activity #{i}" }
    classification
    description
    topic { Topic.first || create(:topic) }
  end
end
