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
FactoryBot.define do
  factory :skill do
    sequence(:name) { |n| "Skill-#{n}" }
    skill_group { create(:skill_group) }
  end
end
