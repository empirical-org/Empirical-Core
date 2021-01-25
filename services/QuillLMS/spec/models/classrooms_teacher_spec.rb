# == Schema Information
#
# Table name: classrooms_teachers
#
#  id           :integer          not null, primary key
#  role         :string           not null
#  created_at   :datetime
#  updated_at   :datetime
#  classroom_id :integer          not null
#  user_id      :integer          not null
#
# Indexes
#
#  index_classrooms_teachers_on_classroom_id             (classroom_id)
#  index_classrooms_teachers_on_role                     (role)
#  index_classrooms_teachers_on_user_id                  (user_id)
#  unique_classroom_and_user_ids_on_classrooms_teachers  (user_id,classroom_id) UNIQUE
#
require 'rails_helper'

RSpec.describe ClassroomsTeacher, type: :model, redis: true do
  let(:classrooms_teacher_with_arbitrary_role) { build(:classrooms_teacher, role: 'hippopotamus') }
  let(:classrooms_teacher_with_null_user_id) { build(:classrooms_teacher, user_id: nil) }
  let(:classrooms_teacher_with_null_classroom_id) { build(:classrooms_teacher, classroom_id: nil) }
  let(:classrooms_teacher) { build(:classrooms_teacher) }

  it { should belong_to(:user) }
  it { should belong_to(:classroom) }

  it { is_expected.to callback(:delete_classroom_minis_cache_for_each_teacher_of_this_classroom).after(:create) }
  it { is_expected.to callback(:reset_lessons_cache_for_teacher).after(:create) }
  it { is_expected.to callback(:delete_classroom_minis_cache_for_each_teacher_of_this_classroom).before(:destroy) }
  it { is_expected.to callback(:reset_lessons_cache_for_teacher).before(:destroy) }

  describe 'teacher' do
    let(:teacher) { create(:classrooms_teacher) }

    it 'should return the associated user' do
      expect(teacher.teacher).to eq(teacher.user)
    end
  end

  describe 'validations' do

    it 'should prevent saving arbitrary role' do
      expect{classrooms_teacher_with_arbitrary_role.save}.to raise_error ActiveRecord::StatementInvalid
    end

    it 'should require a user_id that is not null' do
      expect{classrooms_teacher_with_null_user_id.save}.to raise_error ActiveRecord::StatementInvalid
    end

    it 'should require a classroom_id that is not null' do
      expect{classrooms_teacher_with_null_classroom_id.save}.to raise_error ActiveRecord::StatementInvalid
    end
  end

  describe 'callbacks' do
    let(:classrooms_teacher) { build(:classrooms_teacher) }
    let(:teacher) { classrooms_teacher.teacher }

    it 'should delete_classroom_minis_cache on create' do
      $redis.set("user_id:#{teacher.id}_classroom_minis", {something: 'something'})
      classrooms_teacher.save
      expect($redis.get("user_id:#{teacher.id}_classroom_minis")).to eq nil
    end
  end

end
