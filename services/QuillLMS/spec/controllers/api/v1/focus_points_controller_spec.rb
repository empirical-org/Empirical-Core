# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::FocusPointsController, type: :controller do
  let!(:question) { create(:question) }
  let!(:new_q) do
    create(:question,
      data: {
        Question::FOCUS_POINTS => {
          '0' => { 'text' => 'text', 'feedback'=>'fff' }
        },
        'incorrectSequences'=> [
          { 'text'=>'foo', 'feedback'=>'bar', 'uid' => 'uid1' }
        ]
      }
    )
  end


  describe '#index' do
    it 'should return a list of Question Focus Points' do
      get :index, params: { question_id: question.uid }, as: :json
      expect(JSON.parse(response.body)).to eq(question.focusPoints)
    end

    it 'should return a 404 if the requested Question is not found' do
      get :index, params: { question_id: 'doesnotexist' }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include('The resource you were looking for does not exist')
    end
  end

  describe '#show' do
    it 'should return the containing focus points object' do
      fp_id = question.focusPoints.keys.first
      get :show, params: { question_id: question.uid, id: fp_id }, as: :json
      expect(JSON.parse(response.body)).to eq(question.focusPoints[fp_id])
    end

    it 'should return a 404 if the requested Question is not found' do
      fp_id = question.focusPoints.keys.first
      get :show, params: { question_id: 'doesnotexist', id: fp_id }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include('The resource you were looking for does not exist')
    end

    it 'should return a 404 if the requested FocusPoint is not found' do
      get :show, params: { question_id: question.id, id: 'doesnotexist' }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include('The resource you were looking for does not exist')
    end
  end

  describe '#create' do
    it 'should add a new focus point to the question data' do
      data = { 'text' => 'foo', 'feedback'=>'bar' }
      focus_point_count = question.focusPoints.keys.length
      post :create, params: { question_id: question.uid, focus_point: data }, as: :json
      question.reload
      expect(question.focusPoints.keys.length).to eq(focus_point_count + 1)
    end

    it 'should return a 404 if the requested Question is not found' do
      get :index, params: { question_id: 'doesnotexist' }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include('The resource you were looking for does not exist')
    end
  end

  describe '#update' do
    it 'should update an existing focus point in the question data' do
      data = { 'text' => 'foo', 'feedback'=>'bar' }
      focus_point_uid = question.focusPoints.keys.first
      put :update,
        params: {
          question_id: question.uid,
          id: focus_point_uid,
          focus_point: data
        },
        as: :json

      question.reload
      expect(question.focusPoints[focus_point_uid]).to eq(data)
    end

    it 'should return a 404 if the requested Question is not found' do
      put :update, params: { question_id: 'doesnotexist', id: 'doesnotexist' }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include('The resource you were looking for does not exist')
    end

    it 'should return a 404 if the requested Question does not have the specified focusPoint' do
      put :update, params: { question_id: question.uid, id: 'doesnotexist' }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include('The resource you were looking for does not exist')
    end

    it 'should return a 404 if the focus point is not valid' do
      data = { 'key'=>'-Lp-tB4rOx6sGVpm2AG3','text'=>'(and|','feedback'=>'feedback' }

      focus_point_uid = new_q.focusPoints.keys.first

      put :update,
        params: {
          question_id: new_q.uid,
          id: focus_point_uid,
          focus_point: data
        },
        as: :json

      expect(response.status).to eq(422)
      expect(JSON.parse(response.body)['data']).to include('There is incorrectly formatted regex: (and|')
    end
  end

  describe '#destroy' do
    it 'should delete the focus point' do
      focus_point_uid = question.focusPoints.keys.first
      pre_delete_count = question.focusPoints.keys.length
      delete :destroy, params: { question_id: question.uid, id: focus_point_uid }, as: :json
      question.reload
      expect(question.focusPoints.keys.length).to eq(pre_delete_count - 1)
    end

    it 'should return a 404 if the requested Question is not found' do
      delete :destroy, params: { question_id: 'doesnotexist', id: 'doesnotexist' }
      expect(response.status).to eq(404)
      expect(response.body).to include('The resource you were looking for does not exist')
    end
  end

  describe '#update_all' do
    it 'should replace all focusPoints' do
      data = { '0' => { 'text'=>'text', 'feedback'=>'feedback' } }
      put :update_all, params: { question_id: question.uid, focus_point: data }, as: :json
      question.reload
      expect(question.focusPoints).to eq(data)
    end

    it 'should return a 404 if the requested Question is not found' do
      put :update_all, params: { question_id: 'doesnotexist' }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include('The resource you were looking for does not exist')
    end
  end
end
