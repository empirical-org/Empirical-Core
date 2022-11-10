# frozen_string_literal: true

FactoryBot.define do
  factory :teacher_info_subject_area do
    teacher_info { create(:teacher_info) }
    subject_area { create(:subject_area) }
  end
end
