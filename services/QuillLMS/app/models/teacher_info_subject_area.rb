# frozen_string_literal: true

# == Schema Information
#
# Table name: teacher_info_subject_areas
#
#  id              :bigint           not null, primary key
#  teacher_info_id :bigint
#  subject_area_id :bigint
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
class TeacherInfoSubjectArea < ApplicationRecord
  belongs_to :teacher_info
  belongs_to :subject_area

  validates :teacher_info_id, presence: true
  validates :subject_area_id, presence: true
end
