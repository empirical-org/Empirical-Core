FactoryGirl.define do

  factory :concept_tag_category do
    sequence(:name) { |i| "concept tag category #{i}" }
  end
end
