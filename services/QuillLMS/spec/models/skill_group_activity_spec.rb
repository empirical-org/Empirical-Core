# frozen_string_literal: true

# == Schema Information
#
# Table name: skill_group_activities
#
#  id             :bigint           not null, primary key
#  activity_id    :bigint           not null
#  skill_group_id :bigint           not null
#
# Indexes
#
#  index_skill_group_activities_on_activity_id     (activity_id)
#  index_skill_group_activities_on_skill_group_id  (skill_group_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_id => activities.id)
#  fk_rails_...  (skill_group_id => skill_groups.id)
#
describe SkillGroupActivity, type: :model do
  context 'validations' do
    it { should belong_to(:skill_group) }
    it { should belong_to(:activity) }

    it { should validate_presence_of(:skill_group_id) }
    it { should validate_presence_of(:activity_id) }
  end
end
