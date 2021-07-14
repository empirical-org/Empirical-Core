require 'json'
require 'rails_helper'

describe Api::V1::ConceptFeedbackController, type: :controller do
  let!(:concept_feedback) { create(:concept_feedback) }

  describe "#index" do
    it "should return a list of ConceptFeedbacks" do
      get :index, params: { activity_type: concept_feedback.activity_type }
      expect(JSON.parse(response.body).keys.length).to eq(1)
    end

    it "should include the response from the db" do
      get :index, params: { activity_type: concept_feedback.activity_type }
      expect(JSON.parse(response.body).keys.first).to eq(concept_feedback.uid)
    end
  end

  describe "#show" do
    it "should return the specified concept_feedback" do
      get :show, params: { activity_type: concept_feedback.activity_type, id: concept_feedback.uid }
      expect(JSON.parse(response.body)).to eq(concept_feedback.data)
    end

    it "should return a 404 if the requested ConceptFeedback is not found" do
      get :show, params: { activity_type: concept_feedback.activity_type, id: 'doesnotexist' }
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#create" do
    it "should create a new ConceptFeedback record" do
      uuid = SecureRandom.uuid
      data = {foo: "bar"}
      expect(SecureRandom).to receive(:uuid).and_return(uuid)
      pre_create_count = ConceptFeedback.count
      post :create, params: { activity_type: concept_feedback.activity_type, concept_feedback: data }
      expect(ConceptFeedback.count).to eq(pre_create_count + 1)
    end
  end

  describe "#update" do
    it "should update the existing record" do
      data = {"foo" => "bar"}
      put :update, params: { activity_type: concept_feedback.activity_type, id: concept_feedback.uid, concept_feedback: data }
      concept_feedback.reload
      expect(concept_feedback.data).to eq(data)
    end

    it "should create a new record with the specified UID if one doesn't exit" do
      data = {"foo" => "bar"}
      uid = SecureRandom.uuid
      expect(ConceptFeedback.find_by(uid: uid)).to be_nil
      put :update, params: { activity_type: concept_feedback.activity_type, id: uid, concept_feedback: data }
      expect(ConceptFeedback.find_by(uid: uid)).to be
    end
  end
end
