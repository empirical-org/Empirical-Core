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
describe SkillConcept, type: :model do
  context 'validations' do
    it { should belong_to(:skill) }
    it { should belong_to(:concept) }

    it { should validate_presence_of(:skill_id) }
    it { should validate_presence_of(:concept_id) }
  end
end
