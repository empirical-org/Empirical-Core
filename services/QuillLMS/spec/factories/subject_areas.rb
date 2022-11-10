# frozen_string_literal: true

FactoryBot.define do
  factory :subject_areas do
    sequence(:name) { |n| "Subject Area #{n}" }
    teacher_info_subject_areas { [create(:teacher_info_subject_area)] }
  end
end
