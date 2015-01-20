FactoryGirl.define do

  factory :concept_tag do
    sequence(:name) { |i| "concept tag #{i}" }
    concept_class
  end
end
