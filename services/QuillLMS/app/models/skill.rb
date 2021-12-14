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
class Skill < ApplicationRecord
  belongs_to :skill_group
  has_many :skill_concepts
  has_many :concepts, through: :skill_concepts

  validates_presence_of :skill_group_id
  validates_presence_of :name
end
