# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserCacheable, type: :model do
  let(:user) { build(:user) }
  let(:groups) { {some_id: 1234, page: 1} }

  describe '#all_classrooms_cache' do
    context 'teachers without classrooms' do
      let(:teacher1) { create(:teacher) }
      let(:teacher2) { create(:teacher) }

      it 'should not share cache for users with no classrooms and update on user touches' do
        i = 0
        teacher1_fetch1 = teacher1.all_classrooms_cache(key: 'test.key') { i += 1 }
        teacher2_fetch1 = teacher2.all_classrooms_cache(key: 'test.key') { i += 1 }
        teacher1_fetch2 = teacher1.all_classrooms_cache(key: 'test.key') { i += 1 }
        teacher2_fetch2 = teacher2.all_classrooms_cache(key: 'test.key') { i += 1 }

        # only one teacher is updated
        teacher1.touch

        teacher1_fetch3 = teacher1.all_classrooms_cache(key: 'test.key') { i += 1 }
        teacher2_fetch3 = teacher2.all_classrooms_cache(key: 'test.key') { i += 1 }

        expect(teacher1_fetch1).to eq(1)
        expect(teacher2_fetch1).to eq(2)
        expect(teacher1_fetch2).to eq(1)
        expect(teacher2_fetch2).to eq(2)

        expect(teacher1_fetch3).to eq(3)
        expect(teacher2_fetch3).to eq(2)
      end
    end

    context 'teacher with classrooms' do
      let(:teacher) {create(:teacher_with_one_classroom) }

      it 'should return cached value until the cache_key changes' do
        i = 0
        first_fetch = teacher.all_classrooms_cache(key: 'test.key') { i += 1 }
        second_fetch = teacher.all_classrooms_cache(key: 'test.key') { i += 1 }

        teacher.classrooms_i_teach.first.touch

        post_update_fetch = teacher.all_classrooms_cache(key: 'test.key') { i += 1 }

        expect(first_fetch).to eq(1)
        expect(second_fetch).to eq(1)
        expect(post_update_fetch).to eq(2)
      end

      it 'should keep separate caches for groups, update on cache key change' do
        i = 0
        first_page_fetch1 = teacher.all_classrooms_cache(key: 'test.key', groups: {page: 1}) { i += 1 }
        second_page_fetch1 = teacher.all_classrooms_cache(key: 'test.key', groups: {page: 2}) { i += 1 }

        first_page_fetch2 = teacher.all_classrooms_cache(key: 'test.key', groups: {page: 1}) { i += 1 }
        second_page_fetch2 = teacher.all_classrooms_cache(key: 'test.key', groups: {page: 2}) { i += 1 }

        teacher.classrooms_i_teach.first.touch

        post_update_first_page_fetch = teacher.all_classrooms_cache(key: 'test.key', groups: {page: 1}) { i += 1 }
        post_update_second_page_fetch = teacher.all_classrooms_cache(key: 'test.key', groups: {page: 2}) { i += 1 }

        expect(first_page_fetch1).to eq(1)
        expect(second_page_fetch1).to eq(2)
        expect(first_page_fetch2).to eq(1)
        expect(second_page_fetch2).to eq(2)

        expect(post_update_first_page_fetch).to eq(3)
        expect(post_update_second_page_fetch).to eq(4)
      end
    end

    context 'teacher with multiple classrooms' do
      let(:teacher) {create(:teacher_with_one_classroom) }
      let!(:older_classroom) { create(:classroom) }
      let!(:newer_classroom) { create(:classroom, updated_at: older_classroom.updated_at + 10.days) }
      let!(:older_classrooms_teacher) { create(:classrooms_teacher, user: teacher, role: 'owner', classroom: older_classroom) }
      let!(:newer_classrooms_teacher) { create(:classrooms_teacher, user: teacher, role: 'owner', classroom: newer_classroom) }
      let(:key) { 'test.key' }
      let(:groups) { {page: 1} }

      it 'should use the most recently updated_at classroom for caching' do
        expect(teacher).to receive(:model_cache).with(newer_classroom, key: key, groups: groups, expires_in: subject::DEFAULT_EXPIRATION)

        teacher.all_classrooms_cache(key: key, groups: groups)
      end

      it 'should pass through custom expiration if provided' do
        expires_in = 1.hour

        expect(teacher).to receive(:model_cache).with(newer_classroom, key: key, groups: groups, expires_in: expires_in)

        teacher.all_classrooms_cache(key: key, groups: groups, expires_in: expires_in)
      end
    end
  end

  describe '#classroom_cache' do
    let(:teacher) {create(:teacher) }
    let(:classroom) {create(:classroom) }

    it 'should call model_cache' do
      expect(teacher).to receive(:model_cache).with(classroom, key: 'test.key', groups: {page: 1}, expires_in: subject::DEFAULT_EXPIRATION)

      teacher.classroom_cache(classroom, key: 'test.key', groups: {page: 1})
    end

    it 'should pass through custom expiration if provided' do
      expires_in = 1.hour

      expect(teacher).to receive(:model_cache).with(classroom, key: 'test.key', groups: {page: 1}, expires_in: expires_in)

      teacher.classroom_cache(classroom, key: 'test.key', groups: {page: 1}, expires_in: expires_in)
    end

    it 'should yield to model_cache' do
      expect {|b| teacher.classroom_cache(classroom, key: 'test.key', groups: {page: 1}, &b) }.to yield_control.exactly(1).times
    end

    it 'should return cached value until the cache_key changes' do
      i = 0
      first_fetch = teacher.classroom_cache(classroom, key: 'test.key') { i += 1 }
      second_fetch = teacher.classroom_cache(classroom, key: 'test.key') { i += 1 }

      classroom.touch

      post_update_fetch = teacher.classroom_cache(classroom, key: 'test.key') { i += 1 }

      expect(first_fetch).to eq(1)
      expect(second_fetch).to eq(1)
      expect(post_update_fetch).to eq(2)
    end
  end

  describe '#classroom_unit_cache' do
    let(:teacher) {create(:teacher) }
    let(:classroom_unit) {create(:classroom_unit) }

    it 'should call model_cache' do
      expect(teacher).to receive(:model_cache).with(classroom_unit, key: 'test.key', groups: {page: 1}, expires_in: subject::DEFAULT_EXPIRATION)

      teacher.classroom_unit_cache(classroom_unit, key: 'test.key', groups: {page: 1})
    end

    it 'should pass through custom expiration if provided' do
      expires_in = 1.hour

      expect(teacher).to receive(:model_cache).with(classroom_unit, key: 'test.key', groups: {page: 1}, expires_in: expires_in)

      teacher.classroom_unit_cache(classroom_unit, key: 'test.key', groups: {page: 1}, expires_in: expires_in)
    end

    it 'should yield to model_cache' do
      expect {|b| teacher.classroom_unit_cache(classroom_unit, key: 'test.key', groups: {page: 1}, &b) }.to yield_control.exactly(1).times
    end

    it 'should return cached value until the cache_key changes' do
      i = 0
      first_fetch = teacher.classroom_unit_cache(classroom_unit, key: 'test.key') { i += 1 }
      second_fetch = teacher.classroom_unit_cache(classroom_unit, key: 'test.key') { i += 1 }

      classroom_unit.touch

      post_update_fetch = teacher.classroom_unit_cache(classroom_unit, key: 'test.key') { i += 1 }

      expect(first_fetch).to eq(1)
      expect(second_fetch).to eq(1)
      expect(post_update_fetch).to eq(2)
    end
  end

  describe '#classroom_unit_by_ids_cache' do
    let(:teacher) {create(:teacher) }
    let(:classrooms_teacher) {create(:classrooms_teacher, user: teacher) }
    let(:classroom) { classrooms_teacher.classroom }
    let(:unit_activity1) { create(:unit_activity)}
    let(:activity) { unit_activity1.activity }
    let(:classroom_unit1) {create(:classroom_unit, classroom: classroom, unit: unit_activity1.unit) }
    let(:unit_activity2) { create(:unit_activity, activity: activity)}
    let(:classroom_unit2) {create(:classroom_unit, classroom: classroom, unit: unit_activity2.unit) }
    let(:unit_activity3) { create(:unit_activity, activity: activity)}
    let(:classroom_unit3) {create(:classroom_unit, classroom: classroom, unit: unit_activity3.unit) }

    it 'should call model_cache with last updated unit if no unit_id' do
      classroom_unit2.touch
      expect(teacher).to receive(:model_cache).with(classroom_unit2, key: 'test.key', groups: {page: 1}, expires_in: subject::DEFAULT_EXPIRATION)

      teacher.classroom_unit_by_ids_cache(classroom_id: classroom.id, unit_id: nil, activity_id: activity.id, key: 'test.key', groups: {page: 1})
    end

    it 'should call model_cache with first matching unit if there is a unit_id' do
      expect(teacher).to receive(:model_cache).with(classroom_unit1, key: 'test.key', groups: {page: 1}, expires_in: subject::DEFAULT_EXPIRATION)

      teacher.classroom_unit_by_ids_cache(classroom_id: classroom.id, unit_id: unit_activity1.unit_id, activity_id: activity.id, key: 'test.key', groups: {page: 1})
    end

    it 'should pass through custom expiration if provided' do
      expires_in = 1.hour

      expect(teacher).to receive(:model_cache).with(classroom_unit2, key: 'test.key', groups: {page: 1}, expires_in: expires_in)

      teacher.classroom_unit_by_ids_cache(classroom_id: classroom.id, unit_id: nil, activity_id: activity.id, key: 'test.key', groups: {page: 1}, expires_in: expires_in)
    end

    it 'should yield to model_cache' do
      expect {|b| teacher.classroom_unit_by_ids_cache(classroom_id: classroom.id, unit_id: unit_activity1.unit_id, activity_id: activity.id, key: 'test.key', groups: {page: 1}, &b) }.to yield_control.exactly(1).times
    end

    it 'should return cached value until the cache_key changes' do
      i = 0
      first_fetch = teacher.classroom_unit_by_ids_cache(classroom_id: classroom.id, unit_id: nil, activity_id: activity.id, key: 'test.key') { i += 1 }
      second_fetch = teacher.classroom_unit_by_ids_cache(classroom_id: classroom.id, unit_id: nil, activity_id: activity.id, key: 'test.key') { i += 1 }

      classroom_unit2.touch

      post_update_fetch = teacher.classroom_unit_by_ids_cache(classroom_id: classroom.id, unit_id: nil, activity_id: activity.id, key: 'test.key') { i += 1 }

      expect(first_fetch).to eq(1)
      expect(second_fetch).to eq(1)
      expect(post_update_fetch).to eq(2)
    end
  end

  describe '#model_cache_key' do
    let(:object) { double('fake object') }

    it 'return an array in the expected pattern' do
      key = user.send(:model_cache_key, object, key: 'test_name', groups: groups)

      expect(key).to eq(['test_name', :page, 1, :some_id, 1234, object])
    end

    it 'should use the user as the model cache key if object is nil' do
      key = user.send(:model_cache_key, nil, key: 'test_name', groups: groups)

      expect(key).to eq(['test_name', :page, 1, :some_id, 1234, user])
    end

    it 'should sort by group keys' do
      groups = {zebra: 1234, apple: 'a', quill: 7}
      key = user.send(:model_cache_key, object, key: 'test_name', groups: groups)

      expect(key).to eq(['test_name', :apple, 'a', :quill, 7, :zebra, 1234, object])
    end
  end

  describe '#model_cache' do
    # using an arbitrary AR object with updated_at
    let(:object) { create(:concept) }

    it 'should raise if not passed a block' do
      expect { user.send(:model_cache, object, key: 'test.key', groups: {}) }.to raise_error(LocalJumpError)
    end

    it 'should return cached value until the cache_key changes' do
      i = 0
      first_fetch = user.send(:model_cache, object, key: 'test.key', groups: {}) { i += 1 }
      second_fetch = user.send(:model_cache, object, key: 'test.key', groups: {}) { i += 1 }

      object.touch

      post_update_fetch = user.send(:model_cache, object, key: 'test.key', groups: {}) { i += 1 }

      expect(first_fetch).to eq(1)
      expect(second_fetch).to eq(1)
      expect(post_update_fetch).to eq(2)
    end

    it 'should keep separate caches for groups, update on cache key change' do
      i = 0
      first_page_fetch1 = user.send(:model_cache, object, key: 'test.key', groups: {page: 1}) { i += 1 }
      second_page_fetch1 = user.send(:model_cache, object, key: 'test.key', groups: {page: 2}) { i += 1 }

      first_page_fetch2 = user.send(:model_cache, object, key: 'test.key', groups: {page: 1}) { i += 1 }
      second_page_fetch2 = user.send(:model_cache, object, key: 'test.key', groups: {page: 2}) { i += 1 }

      object.touch

      post_update_first_page_fetch = user.send(:model_cache, object, key: 'test.key', groups: {page: 1}) { i += 1 }
      post_update_second_page_fetch = user.send(:model_cache, object, key: 'test.key', groups: {page: 2}) { i += 1 }

      expect(first_page_fetch1).to eq(1)
      expect(second_page_fetch1).to eq(2)
      expect(first_page_fetch2).to eq(1)
      expect(second_page_fetch2).to eq(2)

      expect(post_update_first_page_fetch).to eq(3)
      expect(post_update_second_page_fetch).to eq(4)
    end

    context 'cache invalidation' do
      let(:teacher) { create(:teacher, :with_classrooms_students_and_activities) }
      let(:key) { 'test.key' }
      let!(:old_value) { teacher.all_classrooms_cache(key: key) { false } }

      it 'should invalidate when an ActivitySession is touched' do
        create(:activity_session, classroom_unit: teacher.classroom_units.first)

        expect(teacher.all_classrooms_cache(key: key) { true }).not_to eq(old_value)
      end

      it 'should invalidate when a ClassroomUnit is touched' do
        teacher.classroom_units.first.touch

        expect(teacher.all_classrooms_cache(key: key) { true }).not_to eq(old_value)
      end

      it 'should invalidate when a ClassroomsTeacher is touched' do
        teacher.classrooms_teachers.first.touch

        expect(teacher.all_classrooms_cache(key: key) { true }).not_to eq(old_value)
      end

      it 'should invalidate when a ClassroomUnitActivityState is touched' do
        create(:classroom_unit_activity_state, classroom_unit: teacher.classroom_units.first)

        expect(teacher.all_classrooms_cache(key: key) { true }).not_to eq(old_value)
      end

      it 'should invalidate when a StudentsClassrooms is touched' do
        teacher.students_i_teach.first.students_classrooms.first.touch

        expect(teacher.all_classrooms_cache(key: key) { true }).not_to eq(old_value)
      end

      it 'should invalidate when a Unit is touched' do
        teacher.classrooms_i_teach.first.units.first.touch

        expect(teacher.all_classrooms_cache(key: key) { true }).not_to eq(old_value)
      end

      it 'should invalidate when a UnitActivity is touched' do
        teacher.classrooms_i_teach.first.units.first.unit_activities.first.touch

        expect(teacher.all_classrooms_cache(key: key) { true }).not_to eq(old_value)
      end
    end
  end
end
