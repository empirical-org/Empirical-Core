# frozen_string_literal: true

# == Schema Information
#
# Table name: diagnostic_question_skills
#
#  id             :bigint           not null, primary key
#  name           :string           not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  question_id    :bigint           not null
#  skill_group_id :bigint           not null
#
# Indexes
#
#  index_diagnostic_question_skills_on_question_id     (question_id)
#  index_diagnostic_question_skills_on_skill_group_id  (skill_group_id)
#
# Foreign Keys
#
#  fk_rails_...  (question_id => questions.id)
#  fk_rails_...  (skill_group_id => skill_groups.id)
#
class DiagnosticQuestionSkill < ApplicationRecord
  belongs_to :skill_group
  belongs_to :question

  validates_presence_of :skill_group_id
  validates_presence_of :question_id
  validates_presence_of :name
end
