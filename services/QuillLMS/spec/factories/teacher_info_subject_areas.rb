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
FactoryBot.define do
  factory :teacher_info_subject_area do
    teacher_info { create(:teacher_info) }
    subject_area { create(:subject_area) }
  end
end
