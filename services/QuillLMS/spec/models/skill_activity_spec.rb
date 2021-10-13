# == Schema Information
#
# Table name: skill_activities
#
#  id         :bigint           not null, primary key
#  activity_id :bigint           not null
#  skill_id   :bigint           not null
#
# Indexes
#
#  index_skill_activitys_on_activity_id  (activity_id)
#  index_skill_activitys_on_skill_id    (skill_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_id => activitys.id)
#  fk_rails_...  (skill_id => skills.id)
#
describe SkillActivity, type: :model do
  context 'validations' do
    it { should belong_to(:skill) }
    it { should belong_to(:activity) }

    it { should validate_presence_of(:skill_id) }
    it { should validate_presence_of(:activity_id) }
  end
end
