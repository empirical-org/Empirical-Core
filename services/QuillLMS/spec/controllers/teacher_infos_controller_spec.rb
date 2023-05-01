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

  describe '#create' do

    it 'should create a teacher info record with the data populated' do
      post :create, params: {minimum_grade_level: 4, maximum_grade_level: 12, subject_area_ids: [subject_area1.id], notification_email_frequency: TeacherInfo::WEEKLY_EMAIL}

      teacher_info = TeacherInfo.find_by(user: user)

      expect(teacher_info.minimum_grade_level).to eq(4)
      expect(teacher_info.maximum_grade_level).to eq(12)
      expect(teacher_info.subject_areas).to eq([subject_area1])
      expect(teacher_info.notification_email_frequency).to eq(TeacherInfo::WEEKLY_EMAIL)
      expect(response.status).to be(200)
    end
  end

  describe '#create with valid role_selected_at_signup' do

    it 'should create a teacher info record with the data populated' do
      session[:role] = User::INDIVIDUAL_CONTRIBUTOR
      post :create, params: {minimum_grade_level: 4, maximum_grade_level: 12, subject_area_ids: [subject_area1.id]}

      teacher_info = TeacherInfo.find_by(user: user)

      expect(teacher_info.role_selected_at_signup).to eq(User::INDIVIDUAL_CONTRIBUTOR)
      expect(response.status).to be(200)
    end
  end

  describe '#create with invalid role_selected_at_signup' do

    it 'should create a teacher info record with role_selected_at_signup defaulted to an empty string' do
      session[:role] = 'invalid-role'
      post :create, params: {minimum_grade_level: 4, maximum_grade_level: 12, subject_area_ids: [subject_area1.id]}

      teacher_info = TeacherInfo.find_by(user: user)

      expect(teacher_info.role_selected_at_signup).to eq('')
      expect(response.status).to be(200)
    end
  end

  describe '#create should not double-create records for a single user' do
    it 'should create a new record if one does not exist for the user' do
      expect do
        post :create, params: {minimum_grade_level: 4, maximum_grade_level: 12, subject_area_ids: [subject_area1.id], notification_email_frequency: TeacherInfo::WEEKLY_EMAIL}

        expect(response.status).to eq(200)
      end.to change(TeacherInfo, :count).by(1)
    end

    it 'should not create a new record if one already exists for the user' do
      create(:teacher_info, user: user)

      expect do
        post :create, params: {minimum_grade_level: 4, maximum_grade_level: 12, subject_area_ids: [subject_area1.id], notification_email_frequency: TeacherInfo::WEEKLY_EMAIL}

        expect(response.status).to eq(400)
      end.not_to change(TeacherInfo, :count)
    end
  end

  describe '#update' do
    let!(:teacher_info) { create(:teacher_info, minimum_grade_level: 1, maximum_grade_level: 7, user: user) }

    before { teacher_info.subject_areas.push(subject_area1) }

    it 'should update the teacher info record with the data populated' do
      put :update, params: {minimum_grade_level: 4, maximum_grade_level: 12, subject_area_ids: [subject_area2.id], notification_email_frequency: TeacherInfo::WEEKLY_EMAIL}

      expect(teacher_info.reload.minimum_grade_level).to eq(4)
      expect(teacher_info.reload.maximum_grade_level).to eq(12)
      expect(teacher_info.reload.subject_areas).to eq([subject_area2])
      expect(teacher_info.reload.notification_email_frequency).to eq(TeacherInfo::WEEKLY_EMAIL)
      expect(response.status).to be(200)
    end
  end

end
