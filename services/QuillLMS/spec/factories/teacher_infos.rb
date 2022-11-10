# frozen_string_literal: true

FactoryBot.define do
  factory :teacher_info do
    teacher { create(:user) }
    minimum_grade_level { 0 }
    maximum_grade_level { 12 }
    subject_areas { [create(:subject_area)] }
  end
end
