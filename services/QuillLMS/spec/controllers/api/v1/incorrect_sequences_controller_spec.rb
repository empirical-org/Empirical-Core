# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::IncorrectSequencesController, type: :controller do
  let!(:question) { create(:question) }

  describe '#index' do
    it 'should include the response from the db' do
      get :index, params: { question_id: question.uid }, as: :json
      expect(JSON.parse(response.body)).to eq(question.incorrectSequences)
    end

    it 'should return a 404 if the requested Question is not found' do
      get :index, params: { question_id: 'doesnotexist' }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include('The resource you were looking for does not exist')
    end
  end

  describe '#show' do
    it 'should return the specified question' do
      is_id = question.incorrectSequences.keys.first
      get :show, params: { question_id: question.uid, id: is_id }, as: :json
      expect(JSON.parse(response.body)).to eq(question.incorrectSequences[is_id])
    end

    it 'should return a 404 if the requested Question is not found' do
      is_id = question.incorrectSequences.keys.first
      get :show, params: { question_id: 'doesnotexist', id: is_id }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include('The resource you were looking for does not exist')
    end

    it 'should return a 404 if the requested Question does not have the specified incorrectSequence' do
      put :show, params: { question_id: question.uid, id: 'doesnotexist' }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include('The resource you were looking for does not exist')
    end
  end

  describe '#create' do
    it 'should add a new incorrect sequence to the question data' do
      data = { 'text' => 'text', 'feedback'=>'feedback' }
      incorrect_sequence_count = question.incorrectSequences.keys.length
      post :create, params: { question_id: question.uid, incorrect_sequence: data }, as: :json
      question.reload
      expect(question.incorrectSequences.keys.length).to eq(incorrect_sequence_count + 1)
    end
  end

  describe '#update' do
    it 'should update an existing incorrect sequence in the question data' do
      data = { 'text' => 'text', 'feedback'=>'feedback' }
      incorrect_sequence_uid = question.incorrectSequences.keys.first
      put :update,
       params: {
         question_id: question.uid,
         id: incorrect_sequence_uid,
         incorrect_sequence: data
        },
        as: :json

      question.reload
      expect(question.incorrectSequences[incorrect_sequence_uid]).to eq(data)
    end

    it 'should return a 404 if the requested Question is not found' do
      put :update, params: { question_id: 'doesnotexist', id: 'doesnotexist' }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include('The resource you were looking for does not exist')
    end

    it 'should return a 404 if the requested Question does not have the specified incorrectSequence' do
      put :update, params: { question_id: question.uid, id: 'doesnotexist' }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include('The resource you were looking for does not exist')
    end
  end

  describe '#destroy' do
    it 'should delete the incorrect sequence' do
      incorrect_sequence_uid = question.incorrectSequences.keys.first
      pre_delete_count = question.incorrectSequences.keys.length
      delete :destroy, params: { question_id: question.uid, id: incorrect_sequence_uid }, as: :json
      question.reload
      expect(question.incorrectSequences.keys.length).to eq(pre_delete_count - 1)
    end

    it 'should return a 404 if the requested Question is not found' do
      delete :destroy, params: { question_id: 'doesnotexist', id: 'doesnotexist' }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include('The resource you were looking for does not exist')
    end
  end

  describe '#update_all' do
    it 'should replace all incorrectSequences' do
      data = { '0'=>{ 'text' => 'text', 'feedback'=>'feedback' } }
      put :update_all, params: { question_id: question.uid, incorrect_sequence: data }, as: :json
      question.reload
      expect(question.incorrectSequences).to eq(data)
    end

    it 'should handle array data as an input' do
      data = [{ 'text' => 'text', 'feedback'=>'feedback' }, { 'text'=>'text2', 'feedback'=>'feedback2' }]
      put :update_all,
        params: {
          question_id: question.uid,
          incorrect_sequence: data
        },
        as: :json

      question.reload
      incorrect_sequences = question.incorrectSequences
      incorrect_sequences.each_with_index do |sequence, index|
        expect(sequence['text']).to eq(data[index]['text'])
        expect(sequence['feedback']).to eq(data[index]['feedback'])
      end
    end

    it 'should return a 404 if the requested Question is not found' do
      put :update_all, params: { question_id: 'doesnotexist' }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include('The resource you were looking for does not exist')
    end
  end
end
