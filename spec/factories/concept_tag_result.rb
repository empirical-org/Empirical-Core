FactoryGirl.define do

  factory :concept_tag_result do
    concept_tag { FactoryGirl.create(:concept_tag, concept_tag_category: FactoryGirl.create(:concept_tag_category)) }
  end
end
