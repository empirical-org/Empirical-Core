require 'rails_helper'

RSpec.describe Lesson, type: :model do
  let(:lesson) { create(:lesson) }

  describe '#valid?' do
    it 'should be valid from the factory' do
      expect(lesson.valid?).to be true
    end

    it 'should be invalid without a uid' do
      lesson.uid = nil
      expect(lesson.valid?).to be false
    end

    it 'should be invalid without data' do
      lesson.data = nil
      expect(lesson.valid?).to be false
    end

    it 'should be invalid if data is not a hash' do
      lesson.data = 1
      expect(lesson.valid?).to be false
      expect(lesson.errors[:data]).to include('must be a hash')
    end

    it 'should be invalid if the uid is not unique and lesson type is the same' do
      new_lesson = Lesson.new(uid: lesson.uid, data: {foo: 'bar'})
      expect(new_lesson.valid?).to be false
    end
  end

  describe '#as_json' do
    it 'should just be the data attribute' do
      expect(lesson.as_json).to eq(lesson.data)
    end
  end
end
