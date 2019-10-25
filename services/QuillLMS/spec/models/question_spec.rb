require 'rails_helper'

RSpec.describe Question, type: :model do
  let(:question) { create(:question) }
  let(:new_focus_point) do
    { 
      '-LlmyO0Cn9LPlVvCfRlW' => {
        'conceptResults' => {
          'asfdGCdbTy6l8xTe-_p6Qg' => {
            'conceptUID' => 'asfdGCdbTy6l8xTe-_p6Qg', 
            'correct' => false,
            'name' => 'Structure | Compound Subjects, Objects, & Predicates | Compound Predicates'
          }
        },
        'feedback' => '<p>Try again. Use <em>and</em> to combine the sentences.</p>', 
        'order' => 1,
        'text' => 'and'
      }
    }
  end
  let(:new_incorrect_sequence) do
    {
      '-LY3zIvRRkbFxdzf90ey' => {
        'conceptResults' => {
          'hJKqVOkQQQgfEsmzOWC1xw' => {
            'conceptUID' => 'hJKqVOkQQQgfEsmzOWC1xw', 
            'correct' => false,
            'name' => 'Conjunctions | Coordinating Conjunctions | And'
          }
        },
        'feedback' => '<p>That is not correct. Put <em>a</em> before both things.</p>', 
        'text' => 'e d|||e D|||e c|||e C|||d d|||d D|||d c|||d C'
      }
    }
  end

  describe '#valid' do
    it 'should be valid from the factory' do
      expect(question.valid?).to be true
    end

    it 'should be invalid without a uid' do
      question.uid = nil
      expect(question.valid?).to be false
    end

    it 'should be invalid without data' do
      question.data = nil
      expect(question.valid?).to be false
    end

    it 'should be invalid if the uid is not unique' do
      new_question = Question.new(uid: question.uid, data: {foo: 'bar'})
      expect(new_question.valid?).to be false
    end
  end

  describe '#add_focus_point' do
    it 'should increase the number of focus points' do
      starting_length = question.data['focusPoints'].keys.length
      question.add_focus_point(new_focus_point)
      expect(question.data['focusPoints'].keys.length).to eq(starting_length + 1)
    end

    it 'should put the new focus point in the data attribute' do
      uid = question.add_focus_point(new_focus_point)
      expect(question.data['focusPoints'][uid]).to eq(new_focus_point)
    end
  end

  describe '#set_focus_point' do
    it 'should return the passed uid' do
      uid = SecureRandom.uuid
      response = question.set_focus_point(uid, {})
      expect(response).to eq(uid)
    end

    it 'should set the value of the specified focusPoint' do
      replace_uid = question.data['focusPoints'].keys.first
      question.set_focus_point(replace_uid, new_focus_point)
      expect(question.data['focusPoints'][replace_uid]).to eq(new_focus_point)
    end
  end

  describe '#update_focus_points' do
    let(:update_data) { {foo: 'bar'} }
    it 'should change the contents of focusPoints' do
      question.update_focus_points(update_data)
      expect(question.data['focusPoints']).to eq(update_data)
    end
  end

  describe '#delete_focus_point' do
    it 'should remove the specified focusPoint' do
      first_focus_point_key = question.data['focusPoints'].keys.first
      question.delete_focus_point(first_focus_point_key)
      expect(question.data['focusPoints'][first_focus_point_key]).to be_nil
    end
  end

  describe '#update_flag' do
    it 'should change the value of the flag key' do
      new_val = 'foo'
      question.update_flag(new_val)
      expect(question.data['flag']).to eq(new_val)
    end
  end

  describe '#update_model_concept' do
    it 'should change the modelConceptUID key' do
      new_val = 'foo'
      question.update_model_concept(new_val)
      expect(question.data['modelConceptUID']).to eq(new_val)
    end
  end

  describe '#add_incorrect_sequence' do
    it 'should increase the number of incorrectSequences' do
      starting_length = question.data['incorrectSequences'].keys.length
      question.add_incorrect_sequence(new_incorrect_sequence)
      expect(question.data['incorrectSequences'].keys.length).to eq(starting_length + 1)
    end

    it 'should put the new incorrectSequence in the data attribute' do
      uid = question.add_incorrect_sequence(new_incorrect_sequence)
      expect(question.data['incorrectSequences'][uid]).to eq(new_incorrect_sequence)
    end
  end

  describe '#set_incorrect_sequence' do
    it 'should return the passed uid' do
      uid = SecureRandom.uuid
      response = question.set_incorrect_sequence(uid, {})
      expect(response).to eq(uid)
    end

    it 'should set the value of the specified incorrectSequence' do
      replace_uid = question.data['incorrectSequences'].keys.first
      question.set_incorrect_sequence(replace_uid, new_incorrect_sequence)
      expect(question.data['incorrectSequences'][replace_uid]).to eq(new_incorrect_sequence)
    end
  end

  describe '#update_incorrect_sequences' do
    let(:update_data) { {foo: 'bar'} }
    it 'should change the contents of incorrectSequences' do
      question.update_incorrect_sequences(update_data)
      expect(question.data['incorrectSequences']).to eq(update_data)
    end
  end

  describe '#as_json' do
    it 'should just be the data attribute' do
      expect(question.as_json).to eq(question.data)
    end
  end
end
