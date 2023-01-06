# frozen_string_literal: true

# == Schema Information
#
# Table name: teacher_info_subject_areas
#
#  id              :bigint           not null, primary key
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  subject_area_id :bigint           not null
#  teacher_info_id :bigint           not null
#
# Indexes
#
#  index_teacher_info_subject_areas_on_subject_area_id  (subject_area_id)
#  index_teacher_info_subject_areas_on_teacher_info_id  (teacher_info_id)
#
# Foreign Keys
#
#  fk_rails_...  (subject_area_id => subject_areas.id)
#  fk_rails_...  (teacher_info_id => teacher_infos.id)
#
FactoryBot.define do
  factory :teacher_info_subject_area do
    teacher_info { create(:teacher_info) }
    subject_area { create(:subject_area) }
  end
end
