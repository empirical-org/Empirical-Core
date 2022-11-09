# frozen_string_literal: true

class TeacherInfoSubjectArea < ApplicationRecord
  belongs_to :teacher_info
  belongs_to :subject_area
end
