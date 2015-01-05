FactoryGirl.define do

  factory :concept_tag do
    sequence(:name) { |i| "concept tag #{i}" }
  end
end
