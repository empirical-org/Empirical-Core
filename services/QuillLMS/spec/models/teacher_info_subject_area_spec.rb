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
require 'rails_helper'

describe TeacherInfoSubjectArea, type: :model, redis: true do
  it { should belong_to(:subject_area) }
  it { should belong_to(:teacher_info) }

  it { is_expected.to validate_presence_of :subject_area_id }
  it { is_expected.to validate_presence_of :teacher_info_id }
end
