# frozen_string_literal: true

# == Schema Information
#
# Table name: skills
#
#  id             :bigint           not null, primary key
#  name           :string           not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  skill_group_id :bigint           not null
#
# Indexes
#
#  index_skills_on_skill_group_id  (skill_group_id)
#
# Foreign Keys
#
#  fk_rails_...  (skill_group_id => skill_groups.id)
#
describe Skill, type: :model do
  context 'validations' do
    it { should belong_to(:skill_group) }
    it { should have_many(:skill_concepts) }
    it { should have_many(:concepts) }

    it { should validate_presence_of(:skill_group_id) }
    it { should validate_presence_of(:name) }
  end
end
