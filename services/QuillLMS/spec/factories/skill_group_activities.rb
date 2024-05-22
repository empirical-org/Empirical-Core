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
FactoryBot.define do
  factory :skill_group_activity do
    skill_group { create(:skill_group) }
    activity { create(:activity) }
  end
end
