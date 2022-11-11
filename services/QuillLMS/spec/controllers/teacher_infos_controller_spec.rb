# frozen_string_literal: true

# == Schema Information
#
# Table name: teacher_infos
#
#  id                  :bigint           not null, primary key
#  minimum_grade_level :integer
#  maximum_grade_level :integer
#  teacher_id          :bigint
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#
require 'rails_helper'

describe TeacherInfosController do
  let(:user) { create(:user) }
  let(:subject_area1) { create(:subject_area) }
  let(:subject_area2) { create(:subject_area)}

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#create' do
    it 'should create a teacher info record with the data populated' do
      post :create, params: {minimum_grade_level: 4, maximum_grade_level: 12, subject_area_ids: [subject_area1.id]}

      teacher_info = TeacherInfo.find_by(teacher: user)

      expect(teacher_info.minimum_grade_level).to eq(4)
      expect(teacher_info.maximum_grade_level).to eq(12)
      expect(teacher_info.subject_areas).to eq([subject_area1])
      expect(response.status).to be(200)
    end
  end

  describe '#update' do
      let!(:teacher_info) { create(:teacher_info, minimum_grade_level: 1, maximum_grade_level: 7) }

      before { teacher_info.subject_areas.push(subject_area1) }

      it 'should update the teacher info record with the data populated' do
      put :update, params: {minimum_grade_level: 4, maximum_grade_level: 12, subject_area_ids: [subject_area2.id]}
      expect(teacher_info.reload.minimum_grade_level).to eq(4)
      expect(teacher_info.reload.maximum_grade_level).to eq(12)
      expect(teacher_info.reload.subject_areas).to eq([subject_area2])
      expect(response.status).to be(200)
    end
  end

end
