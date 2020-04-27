require 'rails_helper'

RSpec.describe Lesson, type: :model do
  let(:lesson) { create(:lesson) }
  let(:question) { create(:question)}

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

    it 'should be invalid without lesson_type' do
      lesson.lesson_type = nil
      expect(lesson.valid?).to be false
    end

    it 'should be invalid if lesson_type is not an allowed value' do
      lesson.lesson_type = 'some_totally_invalid_type'
      expect(lesson.valid?).to be false
    end

    it 'should be invalid if data is not a hash' do
      lesson.data = 1
      expect(lesson.valid?).to be false
      expect(lesson.errors[:data]).to include('must be a hash')
    end

    it 'should be invalid if the uid is not unique and lesson type is the same' do
      new_lesson = Lesson.new(uid: lesson.uid, lesson_type: lesson.lesson_type, data: {foo: 'bar'})
      expect(new_lesson.valid?).to be false
    end
  end

  describe '#as_json' do
    it 'should just be the data attribute' do
      expect(lesson.as_json).to eq(lesson.data)
    end
  end

  describe '#add_question' do
    it 'should add a question to the lesson' do
      old_length = lesson.data["questions"].length
      question_obj = {"key": question.uid, "questionType": "questions"}
      lesson.add_question(question_obj)
      expect(lesson.data["questions"].length).to eq(old_length+1)
      expect(lesson.data["questions"][-1][:"key"]).to eq(question.uid)
      expect(lesson.data["questions"][-1][:"questionType"]).to eq("questions")
    end

    it 'should throw error if the question does not exist' do
      question_obj = {"key": "fakeid", "questionType": "questions"}
      lesson.add_question(question_obj)
      expect(lesson.errors[:question]).to include('Question fakeid does not exist.')
    end

    it 'should throw error if the question type does not match' do
      question_obj = {"key": question.uid, "questionType": "faketype"}
      lesson.add_question(question_obj)
      expect(lesson.errors[:question]).to include("The question type faketype does not match the lesson's question type: questions")
    end
  end
end
