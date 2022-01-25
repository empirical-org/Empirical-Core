# frozen_string_literal: true

require 'json'
require 'rails_helper'

describe Api::V1::QuestionsController, type: :controller do
  let!(:question) { create(:question) }

  describe "#index" do
    before do
      Rails.cache.clear
    end

    it "should return a list of Questions" do
      get :index, params: { question_type: 'connect_sentence_combining' }, as: :json

      expect(JSON.parse(response.body).keys.length).to eq(1)
      expect(JSON.parse(response.body).keys.first).to eq(question.uid)
    end
  end

  describe "#show" do
    before do
      Rails.cache.clear
    end

    it "should return the specified question" do
      get :show, params: { id: question.uid }, as: :json
      expect(JSON.parse(response.body)).to eq(question.data)
    end

    it "should return a 404 if the requested Question is not found" do
      get :show, params: { id: 'doesnotexist' }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end

    it "should return a 404 when not found, but 200 once created" do
      some_id = 'some_id'
      get :show, params: { id: some_id }, as: :json
      expect(response.status).to eq(404)

      create(:question, uid: some_id)
      get :show, params: { id: some_id }, as: :json
      expect(response.status).to eq(200)
    end
  end

  describe "#create" do
    it "should create a new Question record" do
      uuid = SecureRandom.uuid
      data = {foo: "bar"}
      expect(SecureRandom).to receive(:uuid).and_return(uuid)
      pre_create_count = Question.count
      post :create, params: { question_type: 'connect_sentence_combining', question: data }, as: :json
      expect(Question.count).to eq(pre_create_count + 1)
    end
  end

  describe "#update" do
    it "should update the existing record" do
      data = {"foo" => "bar"}
      put :update, params: { id: question.uid, question: data }, as: :json
      question.reload
      expect(question.data).to eq(data)
    end

    it "should return a 404 if the requested Question is not found" do
      get :update, params: { id: 'doesnotexist' }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#update_flag" do
    it "should update the flag attribute in the data" do
      new_flag = 'newflag'
      put :update_flag, params: { id: question.uid, question: { flag: new_flag } }, as: :json
      question.reload
      expect(question.data["flag"]).to eq(new_flag)
    end

    it "should return a 404 if the requested Question is not found" do
      put :update_flag, params: { id: 'doesnotexist', question: { flag: nil } }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#update_model_concept" do
    it "should update the model concept uid attribute in the data" do
      new_model_concept = SecureRandom.uuid
      put :update_model_concept, params: { id: question.uid, question: { modelConcept: new_model_concept } }, as: :json
      question.reload
      expect(question.data["modelConceptUID"]).to eq(new_model_concept)
    end

    it "should return a 404 if the requested Question is not found" do
      put :update_model_concept, params: { id: 'doesnotexist', question: { flag: nil } }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end
end
