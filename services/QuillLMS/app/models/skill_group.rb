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
class SkillGroup < ApplicationRecord
  has_many :skill_group_activities
  has_many :activities, through: :skill_group_activities
  has_many :skills
  has_many :diagnostic_question_skills
  has_many :questions, through: :diagnostic_question_skills

  validates_presence_of :name

  def display_name_for_rails_admin
    "#{name} ##{id}"
  end
end
