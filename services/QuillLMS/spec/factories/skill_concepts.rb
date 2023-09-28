# frozen_string_literal: true

# == Schema Information
#
# Table name: skill_concepts
#
#  id         :bigint           not null, primary key
#  concept_id :bigint           not null
#  skill_id   :bigint           not null
#
# Indexes
#
#  index_skill_concepts_on_concept_id  (concept_id)
#  index_skill_concepts_on_skill_id    (skill_id)
#
# Foreign Keys
#
#  fk_rails_...  (concept_id => concepts.id)
#  fk_rails_...  (skill_id => skills.id)
#
FactoryBot.define do
  factory :skill_concept do
    skill { create(:skill) }
    concept { create(:concept) }
  end
end
