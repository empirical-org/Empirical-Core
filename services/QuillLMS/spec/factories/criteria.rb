# == Schema Information
#
# Table name: criteria
#
#  id                :integer          not null, primary key
#  count             :integer          default(0), not null
#  no_incorrect      :boolean          default(FALSE), not null
#  concept_id        :integer          not null
#  recommendation_id :integer          not null
#
# Indexes
#
#  index_criteria_on_concept_id         (concept_id)
#  index_criteria_on_recommendation_id  (recommendation_id)
#
# Foreign Keys
#
#  fk_rails_...  (concept_id => concepts.id)
#  fk_rails_...  (recommendation_id => recommendations.id)
#
FactoryBot.define do
  factory :criterion do
    concept
    count 0
    recommendation
  end
end
