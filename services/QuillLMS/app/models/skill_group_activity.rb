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
class SkillGroupActivity < ApplicationRecord
  belongs_to :activity
  belongs_to :skill_group

  validates_presence_of :activity_id
  validates_presence_of :skill_group_id
end
