FactoryGirl.define do




  factory :activity_classification, aliases: [:classification] do
    sequence(:name) { |i| "activity cls #{i}" }
    key
  end

end
