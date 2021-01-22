# == Schema Information
#
# Table name: user_milestones
#
#  id           :integer          not null, primary key
#  created_at   :datetime
#  updated_at   :datetime
#  milestone_id :integer          not null
#  user_id      :integer          not null
#
# Indexes
#
#  index_user_milestones_on_milestone_id              (milestone_id)
#  index_user_milestones_on_user_id                   (user_id)
#  index_user_milestones_on_user_id_and_milestone_id  (user_id,milestone_id) UNIQUE
#
require 'rails_helper'

describe UserMilestone, type: :model do
  it { should belong_to(:user) }
  it { should belong_to(:milestone) }
end
