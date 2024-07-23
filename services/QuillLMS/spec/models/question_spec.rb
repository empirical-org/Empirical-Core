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

  it { expect(Question.ancestors).to include(Translatable) }

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

  it { should have_many(:diagnostic_question_optimal_concepts).dependent(:destroy) }

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
      new_question = Question.new(uid: question.uid, data: { foo: 'bar' }, question_type: question.question_type)
      expect(new_question.valid?).to be false
    end

    it 'should be invalid if it has no question type' do
      question.question_type = nil
      expect(question.valid?).to be false
    end

    it 'should be invalid if a focus point has no text' do
      question.data = { Question::FOCUS_POINTS=>{ '0'=>{ 'feedback'=>'foo' } } }
      expect(question.valid?).to be false
      expect(question.errors[:data]).to include('Focus Points and Incorrect Sequences must have text and feedback.')
    end

    it 'should be invalid if a focus point has no feedback' do
      question.data = { Question::FOCUS_POINTS=>{ '0'=>{ 'text'=>'foo' } } }
      expect(question.valid?).to be false
      expect(question.errors[:data]).to include('Focus Points and Incorrect Sequences must have text and feedback.')
    end

    it 'should be invalid if a focus point text is invalid regex' do
      question.data = { Question::FOCUS_POINTS=>{ '0'=>{ 'text'=>'(foo|', 'feedback'=>'bar' } } }
      expect(question.valid?).to be false
      expect(question.errors[:data]).to include('There is incorrectly formatted regex: (foo|')
    end

    it 'should be invalid if the focus point in an array does not have a uid' do
      data = {
        Question::FOCUS_POINTS =>
        [
          { 'text'=>'(foo|bar)', 'feedback'=>'bar' }
        ]
      }
      question.data = data
      expect(question.valid?).to be false
    end

    it 'should be valid if focus point has valid regex and feedback' do
      question.data = { Question::FOCUS_POINTS=>{ '0'=>{ 'text'=>'(foo|bar)', 'feedback'=>'bar' } } }
      expect(question.valid?).to be true
    end

    it 'should be invalid if an incorrect sequence has no text' do
      question.data = { Question::INCORRECT_SEQUENCES=>{ '0'=>{ 'feedback'=>'foo' } } }
      expect(question.valid?).to be false
      expect(question.errors[:data]).to include('Focus Points and Incorrect Sequences must have text and feedback.')
    end

    it 'should be invalid if an incorrect sequence has no feedback' do
      question.data = { Question::INCORRECT_SEQUENCES=>{ '0'=>{ 'text'=>'foo' } } }
      expect(question.valid?).to be false
      expect(question.errors[:data]).to include('Focus Points and Incorrect Sequences must have text and feedback.')
    end

    it 'should be invalid if the incorrectSequence in an array does not have a uid' do
      data = {
        Question::INCORRECT_SEQUENCES =>
        [
          { 'text'=>'(foo|bar)', 'feedback'=>'bar' }
        ]
      }
      question.data = data
      expect(question.valid?).to be false
    end

    it 'should be invalid if an incorrect sequence is invalid regex' do
      question.data = { Question::INCORRECT_SEQUENCES=>{ '0'=>{ 'text'=>'(foo|', 'feedback'=>'bar' } } }
      expect(question.valid?).to be false
      expect(question.errors[:data]).to include('There is incorrectly formatted regex: (foo|')
    end

    it 'should be valid if an incorrect sequence has valid regex and feedback' do
      question.data = { Question::INCORRECT_SEQUENCES=>{ '0'=>{ 'text'=>'(foo|bar)', 'feedback'=>'bar' } } }
      expect(question.valid?).to be true
    end
  end

  describe '#add_focus_point' do
    it 'should increase the number of focus points' do
      starting_length = question.focusPoints.keys.length
      question.add_focus_point(new_focus_point)
      question.reload
      expect(question.focusPoints.keys.length).to eq(starting_length + 1)
    end

    it 'should put the new focus point in the data attribute' do
      uid = question.add_focus_point(new_focus_point)
      question.reload
      expect(question.focusPoints[uid]).to eq(new_focus_point)
    end
  end

  describe '#set_focus_point' do
    it 'should return true on success' do
      uid = SecureRandom.uuid
      response = question.set_focus_point(uid, { 'text'=>'text','feedback'=>'feedback' })
      expect(response).to eq(true)
    end

    it 'should set the value of the specified focusPoint' do
      replace_uid = question.focusPoints.keys.first
      expect(question.focusPoints[replace_uid]).not_to eq(new_focus_point)
      question.set_focus_point(replace_uid, new_focus_point)
      question.reload
      expect(question.focusPoints[replace_uid]).to eq(new_focus_point)
    end
  end

  describe '#update_focus_points' do
    let(:update_data) { { 'foo' => { 'text'=>'text', 'feedback'=>'bar' } } }

    it 'should change the contents of focusPoints' do
      question.update_focus_points(update_data)
      question.reload
      expect(question.focusPoints).to eq(update_data)
    end
  end

  describe '#delete_focus_point' do
    it 'should remove the specified focusPoint' do
      first_focus_point_key = question.focusPoints.keys.first
      question.delete_focus_point(first_focus_point_key)
      question.reload
      expect(question.focusPoints[first_focus_point_key]).to be_nil
    end
  end

  describe '#delete_incorrect_sequence' do
    it 'should remove the specified incorrectSequence if stored in a hash' do
      first_incorrect_sequence_key = question.incorrectSequences.keys.first
      question.delete_incorrect_sequence(first_incorrect_sequence_key)
      question.reload
      expect(question.incorrectSequences[first_incorrect_sequence_key]).to be_nil
    end

    it 'should remove the specified incorrectSequence if stored in an array' do
      data = [
        { 'uid' => 'uid1', 'text'=>'text', 'feedback'=>'bar' },
        { 'uid' => 'uid2', 'text'=>'text', 'feedback'=>'bar' },
        { 'uid' => 'uid3', 'text'=>'text', 'feedback'=>'bar' }
]
      question.update_incorrect_sequences(data)
      first_incorrect_sequence_key = '1'
      question.delete_incorrect_sequence(first_incorrect_sequence_key)
      question.reload
      expect(question.incorrectSequences).to contain_exactly(
        { 'uid' => 'uid1', 'text'=>'text', 'feedback'=>'bar' },
        { 'uid' => 'uid3', 'text'=>'text', 'feedback'=>'bar' }
        )
    end
  end

  describe '#update_flag' do
    it 'should change the value of the flag key' do
      new_val = 'foo'
      question.update_flag(new_val)
      question.reload
      expect(question.flag).to eq(new_val)
    end
  end

  describe '#update_model_concept' do
    it 'should change the modelConceptUID key' do
      new_val = 'foo'
      question.update_model_concept(new_val)
      question.reload
      expect(question.modelConceptUID).to eq(new_val)
    end
  end

  describe '#get_incorrect_sequence' do
    it 'should retrieve the incorrect sequence if it is a hash' do
      data = { 'foo' => 'bar' }
      question.update_incorrect_sequences(data)
      expect(question.get_incorrect_sequence('foo')).to eq('bar')
    end

    it 'should retrieve the incorrect sequence if it is an array' do
      sequence = { 'uid' => '1', 'text' => 'foo', 'feedback' => 'bar' }
      question.update_incorrect_sequences([sequence])
      expect(question.get_incorrect_sequence(0)).to eq(sequence)
    end

    it 'should retrieve the incorrect sequence if it is an array even if the passed id is a string' do
      sequence = { 'uid' => '1', 'text' => 'foo', 'feedback' => 'bar' }
      question.update_incorrect_sequences([sequence])
      expect(question.get_incorrect_sequence('0')).to eq(sequence)
    end
  end

  describe '#add_incorrect_sequence' do
    it 'should increase the number of incorrectSequences' do
      starting_length = question.incorrectSequences.keys.length
      question.add_incorrect_sequence(new_incorrect_sequence)
      question.reload
      expect(question.incorrectSequences.keys.length).to eq(starting_length + 1)
    end

    it 'should put the new incorrectSequence in the data attribute' do
      uid = question.add_incorrect_sequence(new_incorrect_sequence)
      question.reload
      expect(question.incorrectSequences[uid]).to eq(new_incorrect_sequence)
    end

    context 'incorrectSequence is an array' do
      let(:original_incorrect_sequences) {
        [
          { 'text'=>'text', 'feedback'=>'bar' },
          { 'text'=>'text', 'feedback'=>'bar' },
          { 'text'=>'text', 'feedback'=>'bar' }
        ]
      }
      let(:length) { original_incorrect_sequences.length }

      before do
        question.update_incorrect_sequences(original_incorrect_sequences)
      end

      it 'assigns an "id" of array length' do
        question.add_incorrect_sequence(new_incorrect_sequence)
        new_data = question.reload.incorrectSequences[length]
        new_data.delete('uid') # remove the added uid
        expect(new_data).to eq(new_incorrect_sequence)
      end

      it 'adds a uid to the new sequence' do
        question.add_incorrect_sequence(new_incorrect_sequence)
        expect(question.reload.incorrectSequences.last['uid']).to be_present
      end
    end
  end

  describe '#set_incorrect_sequence' do
    it 'should return true on success' do
      uid = SecureRandom.uuid
      response = question.set_incorrect_sequence(uid, { 'text'=>'Text','feedback'=>'feedback' })
      expect(response).to eq(true)
    end

    it 'should set the value of the specified incorrectSequence if in hash' do
      replace_uid = question.incorrectSequences.keys.first
      question.set_incorrect_sequence(replace_uid, new_incorrect_sequence)
      question.reload
      expect(question.incorrectSequences[replace_uid]).to eq(new_incorrect_sequence)
    end

    context 'array' do
      before do
        question.data['incorrectSequences'] = [
          { 'text'=>'text1','feedback'=>'feedback1', 'uid' => 'uid1' },
          { 'text'=>'text2','feedback'=>'feedback2', 'uid' => 'uid2' },
          { 'text'=>'text3','feedback'=>'feedback3', 'uid' => 'uid3' }
        ]
        question.save
      end

      it 'should set the value of the specified incorrectSequence' do
        replace_uid = 0
        new_incorrect_sequence = { 'text' => 't4', 'feedback' => 'f4', 'uid' => 'u4' }
        question.set_incorrect_sequence(replace_uid, new_incorrect_sequence)
        question.reload
        new_data = question.incorrectSequences[replace_uid]
        expect(new_data).to eq(new_incorrect_sequence)
      end

      it 'should add a uid to the incorrectSequence' do
        replace_uid = 0
        question.set_incorrect_sequence(replace_uid, new_incorrect_sequence)
        question.reload
        new_sequence = question.incorrectSequences[replace_uid]
        expect(new_sequence['uid']).to be_present
      end

      it 'does not replace an existing uid' do
        new_incorrect_sequence = { 'text' => 'foo', 'feedback' => 'bar', 'uid' => 'uid1' }
        replace_uid = 0
        question.set_incorrect_sequence(replace_uid, new_incorrect_sequence)
        question.reload
        new_sequence = question.incorrectSequences[replace_uid]
        expect(new_sequence['uid']).to eq('uid1')
      end
    end
  end

  describe '#update_incorrect_sequences' do
    subject { question.update_incorrect_sequences(update_data) }

    context 'the update data is an array' do
      let(:update_data) { [{ 'text'=>'text', 'feedback'=>'bar' }] }

      it 'should add uids to each of the sequences' do
        subject
        question.reload
        sequences = question.incorrectSequences
        sequences.each do |sequence|
          expect(sequence['uid']).to be_present
        end
      end

      it 'should change the contents of incorrectSequences' do
        subject
        question.reload
        sequences = question.incorrectSequences
        sequences.each_with_index do |sequence, index|
          expect(sequence['text']).to eq(update_data[index]['text'])
          expect(sequence['feedback']).to eq(update_data[index]['feedback'])
        end
      end
    end

    context 'the update data is a hash' do
      let(:update_data) { { 'foo' => { 'text'=>'text', 'feedback'=>'bar' } } }

      it 'should change the contents of incorrectSequences' do
        subject
        question.reload
        expect(question.incorrectSequences).to eq(update_data)
      end
    end
  end

  describe '#as_json' do
    subject { question.as_json(options) }

    let(:options) { nil }

    it 'should just be the data attribute' do
      expect(subject).to eq(question.data)
    end

    context 'a locale is passed in' do
      let(:locale) { "ch-zn" }
      let(:options) { { locale: } }

      it 'should return translated_data(locale:)' do
        expect(question).to receive(:translated_data).with(locale:)
        subject
      end
    end
  end



  describe '#refresh_cache' do
    let!(:question) { create(:question, uid: '1234', data: { 'foo' => 'initial_value' }) }

    it 'should queue a cache refresh job on update' do
      expect(Rails.cache).to receive(:delete).with(Question::CACHE_KEY_QUESTION + question.uid)
      expect(Rails.cache).to receive(:delete).with(Question::CACHE_KEY_ALL + question.question_type)
      expect(RefreshQuestionCacheWorker).to receive(:perform_async).with(question.question_type, question.uid)

      question.update(data: { 'foo' => 'new_value' })
    end
  end

  describe 'question cache methods' do
    let!(:question) { create(:question, uid: '1234', data: { 'foo' => 'initial_value' }) }

    it 'should refresh cache for all questions, when refresh: true is passed' do
      json = JSON.parse(Question.all_questions_json_cached(question.question_type))
      expect(json['1234']['foo']).to eq('initial_value')

      question.update(data: { 'foo' => 'new_value' })
      Question.all_questions_json_cached(question.question_type, refresh: true)

      new_json = JSON.parse(Question.all_questions_json_cached(question.question_type))
      expect(new_json['1234']['foo']).to eq('new_value')
    end

    it 'should refresh cache for individual questions, when refresh: true is passed' do
      json = JSON.parse(Question.question_json_cached(question.uid))
      expect(json['foo']).to eq('initial_value')

      question.update(data: { 'foo' => 'new_value' })
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

      expect { question.rematch_type }.to raise_error(KeyError)
    end
  end

  describe '#save_uids_for(type)' do
    subject { question.save_uids_for(type) }

    let(:type1) { { 'text' => 'foo', 'feedback' => 'bar' } }
    let(:type2) { { 'text' => 'baz', 'feedback' => 'qux' } }

    before do
      question.data[type] = data
      question.save
    end

    context 'type is focusPoints' do
      let(:type) { Question::FOCUS_POINTS }

      context 'the focusPoints are an array' do
        let(:data) { [type1, type2] }

        it 'adds a uid to each focusPoint in the array' do
          subject
          question.reload.data[type].each do |item|
            expect(item['uid']).to be_present
          end
        end

        context 'the uid already exists for a data point' do
          let(:type1) { { 'uid' => 'uid1', 'text' => 'foo', 'feedback' => 'bar' } }
          let(:type2) { { 'uid' => 'uid2', 'text' => 'baz', 'feedback' => 'qux' } }

          it 'does not change the uid if it already exists' do
            subject
            uids = question.reload.data[type].map{ |i| i['uid'] }
            expect(uids).to eq(['uid1', 'uid2'])
          end
        end
      end

      context 'the focusPoints are a hash' do
        let(:data) { { 'uid1' => type1, 'uid2' => type2 } }

        it 'does nothing' do
          subject
          expect(question.reload.data[type]).to eq(data)
        end
      end
    end

    context 'type is incorrectSequences' do
      let(:type) { Question::INCORRECT_SEQUENCES }

      context 'the incorrectSequences are an array' do
        let(:data) { [type1, type2] }

        it 'adds a uid to each focusPoint in the array' do
          subject
          question.reload.data[type].each do |item|
            expect(item['uid']).to be_present
          end
        end
      end

      context 'the incorrectSequences are a hash' do
        let(:data) { { 'uid1' => type1, 'uid2' => type2 } }

        it 'does nothing' do
          subject
          expect(question.reload.data[type]).to eq(data)
        end
      end
    end
  end

end
