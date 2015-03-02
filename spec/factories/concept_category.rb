FactoryGirl.define do

  factory :concept_category do
    sequence(:name) { |i| "concept tag category #{i}" }
    concept_class
  end
end
