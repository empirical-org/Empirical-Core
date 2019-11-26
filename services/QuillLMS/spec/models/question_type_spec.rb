require 'rails_helper'

RSpec.describe QuestionType, type: :model do
  let(:question_type) { create(:question_type)}
  describe '#valid?' do
    it 'should be valid from the factory' do
      expect(question_type.valid?).to be true
    end

    it 'should be invalid without an id' do
      question_type.id = nil
      expect(question_type.valid?).to be false
    end

    it 'should be invalid without a name' do
      question_type.name = nil
      expect(question_type.valid?).to be false
    end

    it 'should be invalid if the name is not unique' do
      new_question_type = QuestionType.new(name: question_type.name)
      expect(new_question_type.valid?).to be false
    end
  end
end
