FactoryGirl.define do

  factory :concept_class do
    sequence(:name) { |i| "concept tag category #{i}" }
  end
end
