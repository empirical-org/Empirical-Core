# frozen_string_literal: true

# == Schema Information
#
# Table name: skill_groups
#
#  id           :bigint           not null, primary key
#  description  :text
#  name         :string           not null
#  order_number :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
describe SkillGroup, type: :model do
  context 'validations' do
    it { should have_many(:skill_group_activities) }
    it { should have_many(:activities).through(:skill_group_activities) }
    it { should have_many(:skills) }

    it { should validate_presence_of(:name) }
  end
end
