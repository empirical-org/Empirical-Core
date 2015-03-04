FactoryGirl.define do

  factory :concept_class do
    sequence(:name) { |i| "concept tag class #{i}" }
  end
end
