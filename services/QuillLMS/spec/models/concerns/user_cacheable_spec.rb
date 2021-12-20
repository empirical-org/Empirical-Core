# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserCacheable, type: :model do
  let(:user) { build(:user) }
  let(:groups) { {some_id: 1234, page: 1} }

  describe '#all_classrooms_cache' do
    context 'teachers without classrooms' do
      let (:teacher1) { create(:teacher) }
      let (:teacher2) { create(:teacher) }

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
      let (:teacher) {create(:teacher_with_one_classroom) }

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
  end

  describe '#model_cache_key' do
    let(:object) { double('fake object') }

    it 'return an array in the expected pattern' do
      key = user.send(:model_cache_key, object, key: 'test_name', groups: groups)

      expect(key).to eq(['test_name', :page, 1, :some_id, 1234, object])
    end
  end
end
