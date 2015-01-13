FactoryGirl.define do

  factory :concept_tag do
    sequence(:name) { |i| "concept tag #{i}" }
    # concept_tag_category { FactoryGirl.create(:concept_tag_category) }
  end
end
