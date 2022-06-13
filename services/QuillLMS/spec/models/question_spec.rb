# frozen_string_literal: true

# == Schema Information
#
# Table name: questions
#
#  id            :integer          not null, primary key
#  data          :jsonb            not null
#  question_type :string           not null
#  uid           :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_questions_on_question_type  (question_type)
#  index_questions_on_uid            (uid) UNIQUE
#
require 'rails_helper'

RSpec.describe Question, type: :model do
  let(:question) { create(:question) }
  let(:new_focus_point) do
    {
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
  end
  let(:new_incorrect_sequence) do
    {
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
  end

  describe '#valid?' do
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

    it 'should be invalid if data is not a hash' do
      question.data = 1
      expect(question.valid?).to be false
      expect(question.errors[:data]).to include('must be a hash')
    end

    it 'should be invalid if the uid is not unique and question type is the same' do
      new_question = Question.new(uid: question.uid, data: {foo: 'bar'}, question_type: question.question_type)
      expect(new_question.valid?).to be false
    end

    it 'should be invalid if it has no question type' do
      question.question_type = nil
      expect(question.valid?).to be false
    end

    it 'should be invalid if a focus point has no text' do
      question.data = {'focusPoints'=>{'0'=>{'feedback'=>'foo'}}}
      expect(question.valid?).to be false
      expect(question.errors[:data]).to include('Focus Points and Incorrect Sequences must have text and feedback.')
    end

    it 'should be invalid if a focus point has no feedback' do
      question.data = {'focusPoints'=>{'0'=>{'text'=>'foo'}}}
      expect(question.valid?).to be false
      expect(question.errors[:data]).to include('Focus Points and Incorrect Sequences must have text and feedback.')
    end

    it 'should be invalid if a focus point text is invalid regex' do
      question.data = {'focusPoints'=>{'0'=>{'text'=>'(foo|', 'feedback'=>'bar'}}}
      expect(question.valid?).to be false
      expect(question.errors[:data]).to include('There is incorrectly formatted regex: (foo|')
    end

    it 'should be valid if focus point has valid regex and feedback' do
      question.data = {'focusPoints'=>{'0'=>{'text'=>'(foo|bar)', 'feedback'=>'bar'}}}
      expect(question.valid?).to be true
    end

    it 'should be invalid if an incorrect sequence has no text' do
      question.data = {'incorrectSequences'=>{'0'=>{'feedback'=>'foo'}}}
      expect(question.valid?).to be false
      expect(question.errors[:data]).to include('Focus Points and Incorrect Sequences must have text and feedback.')
    end

    it 'should be invalid if an incorrect sequence has no feedback' do
      question.data = {'incorrectSequences'=>{'0'=>{'text'=>'foo'}}}
      expect(question.valid?).to be false
      expect(question.errors[:data]).to include('Focus Points and Incorrect Sequences must have text and feedback.')
    end

    it 'should be invalid if an incorrect sequence is invalid regex' do
      question.data = {'incorrectSequences'=>{'0'=>{'text'=>'(foo|', 'feedback'=>'bar'}}}
      expect(question.valid?).to be false
      expect(question.errors[:data]).to include('There is incorrectly formatted regex: (foo|')
    end

    it 'should be valid if an incorrect sequence has valid regex and feedback' do
      question.data = {'incorrectSequences'=>{'0'=>{'text'=>'(foo|bar)', 'feedback'=>'bar'}}}
      expect(question.valid?).to be true
    end
  end

  describe '#add_focus_point' do
    it 'should increase the number of focus points' do
      starting_length = question.data['focusPoints'].keys.length
      question.add_focus_point(new_focus_point)
      question.reload
      expect(question.data['focusPoints'].keys.length).to eq(starting_length + 1)
    end

    it 'should put the new focus point in the data attribute' do
      uid = question.add_focus_point(new_focus_point)
      question.reload
      expect(question.data['focusPoints'][uid]).to eq(new_focus_point)
    end
  end

  describe '#set_focus_point' do
    it 'should return true on success' do
      uid = SecureRandom.uuid
      response = question.set_focus_point(uid, {"text"=>"text","feedback"=>"feedback"})
      expect(response).to eq(true)
    end

    it 'should set the value of the specified focusPoint' do
      replace_uid = question.data['focusPoints'].keys.first
      expect(question.data['focusPoints'][replace_uid]).not_to eq(new_focus_point)
      question.set_focus_point(replace_uid, new_focus_point)
      question.reload
      expect(question.data['focusPoints'][replace_uid]).to eq(new_focus_point)
    end
  end

  describe '#update_focus_points' do
    let(:update_data) { {"foo" => {"text"=>"text", "feedback"=>"bar"} } }

    it 'should change the contents of focusPoints' do
      question.update_focus_points(update_data)
      question.reload
      expect(question.data['focusPoints']).to eq(update_data)
    end
  end

  describe '#delete_focus_point' do
    it 'should remove the specified focusPoint' do
      first_focus_point_key = question.data['focusPoints'].keys.first
      question.delete_focus_point(first_focus_point_key)
      question.reload
      expect(question.data['focusPoints'][first_focus_point_key]).to be_nil
    end
  end

  describe '#delete_incorrect_sequence' do
    it 'should remove the specified incorrectSequence if stored in a hash' do
      first_incorrect_sequence_key = question.data['incorrectSequences'].keys.first
      question.delete_incorrect_sequence(first_incorrect_sequence_key)
      question.reload
      expect(question.data['incorrectSequences'][first_incorrect_sequence_key]).to be_nil
    end

    it 'should remove the specified incorrectSequence if stored in an array' do
      question.update_incorrect_sequences([{"text"=>"text", "feedback"=>"bar"}, {"text"=>"text", "feedback"=>"bar"}, {"text"=>"text", "feedback"=>"bar"}])
      first_incorrect_sequence_key = "1"
      question.delete_incorrect_sequence(first_incorrect_sequence_key)
      question.reload
      expect(question.data['incorrectSequences']).to contain_exactly({"text"=>"text", "feedback"=>"bar"}, {"text"=>"text", "feedback"=>"bar"})
    end
  end

  describe '#update_flag' do
    it 'should change the value of the flag key' do
      new_val = 'foo'
      question.update_flag(new_val)
      question.reload
      expect(question.data['flag']).to eq(new_val)
    end
  end

  describe '#update_model_concept' do
    it 'should change the modelConceptUID key' do
      new_val = 'foo'
      question.update_model_concept(new_val)
      question.reload
      expect(question.data['modelConceptUID']).to eq(new_val)
    end
  end

  describe '#get_incorrect_sequence' do
    it 'should retrieve the incorrect sequence if it is a hash' do
      data = {"foo" => "bar"}
      question.update_incorrect_sequences(data)
      expect(question.get_incorrect_sequence("foo")).to eq("bar")
    end

    it 'should retrieve the incorrect sequence if it is an array' do
      data = ["foo"]
      question.update_incorrect_sequences(data)
      expect(question.get_incorrect_sequence(0)).to eq("foo")
    end

    it 'should retrieve the incorrect sequence if it is an array even if the passed id is a string' do
      data = [{"text"=>"foo","feedback"=>"bar"}]
      question.update_incorrect_sequences(data)
      expect(question.get_incorrect_sequence("0")).to eq({"text"=>"foo","feedback"=>"bar"})
    end
  end

  describe '#add_incorrect_sequence' do
    it 'should increase the number of incorrectSequences' do
      starting_length = question.data['incorrectSequences'].keys.length
      question.add_incorrect_sequence(new_incorrect_sequence)
      question.reload
      expect(question.data['incorrectSequences'].keys.length).to eq(starting_length + 1)
    end

    it 'should assign an "id" of array length if incorrectSequence is an array' do
      original_incorrect_sequences = [{"1" => {"text"=>"text", "feedback"=>"bar"}}, {"2" => {"text"=>"text", "feedback"=>"bar"}}, {"3" => {"text"=>"text", "feedback"=>"bar"}}]
      original_length = original_incorrect_sequences.length
      question.update_incorrect_sequences(original_incorrect_sequences)
      question.add_incorrect_sequence(new_incorrect_sequence)
      expect(question.data["incorrectSequences"][original_length]).to eq(new_incorrect_sequence)
    end

    it 'should put the new incorrectSequence in the data attribute' do
      uid = question.add_incorrect_sequence(new_incorrect_sequence)
      question.reload
      expect(question.data['incorrectSequences'][uid]).to eq(new_incorrect_sequence)
    end
  end

  describe '#set_incorrect_sequence' do
    it 'should return true on success' do
      uid = SecureRandom.uuid
      response = question.set_incorrect_sequence(uid, {"text"=>"Text","feedback"=>"feedback"})
      expect(response).to eq(true)
    end

    it 'should set the value of the specified incorrectSequence if in hash' do
      replace_uid = question.data['incorrectSequences'].keys.first
      question.set_incorrect_sequence(replace_uid, new_incorrect_sequence)
      question.reload
      expect(question.data['incorrectSequences'][replace_uid]).to eq(new_incorrect_sequence)
    end

    it 'should set the value of the specified incorrectSequence if in array' do
      question.update_incorrect_sequences([{"text"=>"text1","feedback"=>"feedback1"},{"text"=>"text2","feedback"=>"feedback2"},{"text"=>"text3","feedback"=>"feedback3"}])
      replace_uid = 0
      question.set_incorrect_sequence(replace_uid, new_incorrect_sequence)
      question.reload
      expect(question.data['incorrectSequences'][replace_uid]).to eq(new_incorrect_sequence)
    end
  end

  describe '#update_incorrect_sequences' do
    let(:update_data) { {"foo" => {"text"=>"text", "feedback"=>"bar"} }}

    it 'should change the contents of incorrectSequences' do
      question.update_incorrect_sequences(update_data)
      question.reload
      expect(question.data['incorrectSequences']).to eq(update_data)
    end
  end

  describe '#as_json' do
    it 'should just be the data attribute' do
      expect(question.as_json).to eq(question.data)
    end
  end

  describe '#refresh_cache' do
    let!(:question) {create(:question, uid: '1234', data: {'foo' => 'initial_value'})}

    it 'should queue a cache refresh job on update' do
      expect(Rails.cache).to receive(:delete).with(Question::CACHE_KEY_QUESTION + question.uid)
      expect(Rails.cache).to receive(:delete).with(Question::CACHE_KEY_ALL + question.question_type)
      expect(RefreshQuestionCacheWorker).to receive(:perform_async).with(question.question_type, question.uid)

      question.update(data: {'foo' => 'new_value'})
    end
  end

  describe 'question cache methods' do
    let!(:question) {create(:question, uid: '1234', data: {'foo' => 'initial_value'})}

    it 'should refresh cache for all questions, when refresh: true is passed' do
      json = JSON.parse(Question.all_questions_json_cached(question.question_type))
      expect(json['1234']['foo']).to eq('initial_value')

      question.update(data: {'foo' => 'new_value'})
      Question.all_questions_json_cached(question.question_type, refresh: true)

      new_json = JSON.parse(Question.all_questions_json_cached(question.question_type))
      expect(new_json['1234']['foo']).to eq('new_value')
    end

    it 'should refresh cache for individual questions, when refresh: true is passed' do
      json = JSON.parse(Question.question_json_cached(question.uid))
      expect(json['foo']).to eq('initial_value')

      question.update(data: {'foo' => 'new_value'})
      Question.question_json_cached(question.uid, refresh: true)

      new_json = JSON.parse(Question.question_json_cached(question.uid))
      expect(new_json['foo']).to eq('new_value')
    end
  end

  describe 'rematch_type' do
    it 'should be valid for each question_type' do
      Question::TYPES.each do |type|
        question = build(:question, question_type: type)
        question.rematch_type
      end
    end

    it 'should raise for an invalid type' do
      question = build(:question, question_type: 'non-existent key')

      expect {question.rematch_type }.to raise_error(KeyError)
    end
  end
end
