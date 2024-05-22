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
  let(:subject_area1) { create(:subject_area) }
  let(:subject_area2) { create(:subject_area)}
  let(:user) { create(:user) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#update' do
    let!(:teacher_info) { create(:teacher_info, minimum_grade_level: 1, maximum_grade_level: 7, show_students_exact_score: true, user: user) }

    before { teacher_info.subject_areas.push(subject_area1) }

    it 'should update the teacher info record with the data populated' do
      put :update, params: {minimum_grade_level: 4, maximum_grade_level: 12, subject_area_ids: [subject_area2.id], notification_email_frequency: TeacherInfo::WEEKLY_EMAIL}

      expect(teacher_info.reload.minimum_grade_level).to eq(4)
      expect(teacher_info.reload.maximum_grade_level).to eq(12)
      expect(teacher_info.reload.subject_areas).to eq([subject_area2])
      expect(teacher_info.reload.notification_email_frequency).to eq(TeacherInfo::WEEKLY_EMAIL)
      expect(response.status).to be(200)
    end

    describe 'updating show_students_exact_score' do
      it 'should update the teacher info record if show_students_exact_score is false' do
        put :update, params: {show_students_exact_score: false}

        expect(teacher_info.reload.show_students_exact_score).to eq(false)
      end

      it 'should update the teacher info record if show_students_exact_score is true' do
        teacher_info.update(show_students_exact_score: false)

        put :update, params: {show_students_exact_score: true}

        expect(teacher_info.reload.show_students_exact_score).to eq(true)
      end

      it 'should not update the teacher info record if show_students_exact_score does not cast to true or false' do
        put :update, params: {show_students_exact_score: nil}

        expect(teacher_info.reload.show_students_exact_score).to eq(true)
      end
    end
  end

end
