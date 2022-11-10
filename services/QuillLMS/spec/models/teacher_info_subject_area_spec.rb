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
require 'rails_helper'

describe TeacherInfoSubjectArea, type: :model, redis: true do
  it { should belong_to(:subject_area) }
  it { should belong_to(:teacher_info) }
end
