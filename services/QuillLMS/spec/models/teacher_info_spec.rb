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

describe TeacherInfo, type: :model, redis: true do
  it { should have_many(:subject_areas) }
  it { should have_many(:teacher_info_subject_areas) }
  it { should belong_to(:user) }

  it {should validate_numericality_of(:minimum_grade_level)}
  it {should validate_numericality_of(:maximum_grade_level)}

  it {should validate_presence_of(:user_id)}
  it {should validate_uniqueness_of(:user_id)}

  let!(:teacher_info) {create(:teacher_info)}
  let!(:teacher) {create(:teacher)}

  describe 'minimum_grade_level=' do
    it 'should set the minimum grade level to 0 if it is passed in as K' do
      teacher_info = TeacherInfo.create(minimum_grade_level: 'K')
      expect(teacher_info.attributes["minimum_grade_level"]).to equal(0)
    end
  end

  describe 'maximum_grade_level=' do
    it 'should set the maximum grade level to 0 if it is passed in as K' do
      teacher_info = TeacherInfo.create(maximum_grade_level: 'K')
      expect(teacher_info.attributes["maximum_grade_level"]).to equal(0)
    end
  end

  describe 'minimum_grade_level' do
    it 'should read the minimum grade level as K if it is saved as 0' do
      teacher_info = TeacherInfo.create(minimum_grade_level: 0)
      expect(teacher_info.minimum_grade_level).to equal('K')
    end
  end

  describe 'maximum_grade_level' do
    it 'should read the minimum grade level as K if it is saved as 0' do
      teacher_info = TeacherInfo.create(maximum_grade_level: 0)
      expect(teacher_info.maximum_grade_level).to equal('K')
    end
  end

  describe 'teacher' do
    it 'should read the user for the teacher' do
      expect(teacher_info.teacher).to eq(teacher_info.user)
    end
  end

  describe 'teacher_id' do
    it 'should read the user_id for the teacher_id' do
      expect(teacher_info.teacher_id).to eq(teacher_info.user_id)
    end
  end

  describe 'teacher=' do
    it 'should set the user for the teacher' do
      teacher_info.teacher = teacher
      expect(teacher_info.user).to eq(teacher)
    end
  end

  describe 'teacher_id=' do
    it 'should set the user_id for the teacher_id' do
      teacher_info.teacher_id = teacher.id
      expect(teacher_info.user_id).to eq(teacher.id)
    end
  end

end
