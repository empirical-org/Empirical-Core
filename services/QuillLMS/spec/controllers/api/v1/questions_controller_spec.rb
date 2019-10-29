require 'json'
require 'rails_helper'

describe Api::V1::QuestionsController, type: :controller do
  let!(:question) { create(:question) }

  describe "#index" do
    it "should return a list of Questions" do
      get :index
      expect(JSON.parse(response.body).keys.length).to eq(1)
    end

    it "should include the response from the db" do
      get :index
      expect(JSON.parse(response.body).keys.first).to eq(question.uid)
    end
  end

  describe "#show" do
    it "should return the specified question" do
      get :show, id: question.uid
      expect(JSON.parse(response.body)).to eq(question.data)
    end

    it "should return a 404 if the requested Question is not found" do
      get :show, id: 'doesnotexist'
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#create" do
    it "should create a new Question record" do
      uuid = SecureRandom.uuid
      data = {foo: "bar"}
      expect(SecureRandom).to receive(:uuid).and_return(uuid)
      pre_create_count = Question.count
      post :create, question: data
      expect(Question.count).to eq(pre_create_count + 1)
    end
  end

  describe "#update" do
    it "should update the existing record" do
      data = {"foo" => "bar"}
      put :update, id: question.uid, question: data
      question.reload
      expect(question.data).to eq(data)
    end

    it "should return a 404 if the requested Question is not found" do
      get :update, id: 'doesnotexist'
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#destroy" do
    it "should delete the existing record" do
      delete :destroy, id: question.uid
      expect(Question.find_by(uid: question.uid)).to be_nil
    end

    it "should return a 404 if the requested Question is not found" do
      delete :destroy, id: 'doesnotexist'
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#create_focus_point" do
    it "should add a new focus point to the question data" do
      data = {"foo" => "bar"}
      focus_point_count = question.data["focusPoints"].keys.length
      post :create_focus_point, id: question.uid, question: data
      question.reload
      expect(question.data["focusPoints"].keys.length).to eq(focus_point_count + 1)
    end
  end

  describe "#update_focus_point" do
    it "should update an existing focus point in the question data" do
      data = {"foo" => "bar"}
      focus_point_uid = question.data["focusPoints"].keys.first
      put :update_focus_point, id: question.uid, fp_id: focus_point_uid, question: data
      question.reload
      expect(question.data["focusPoints"][focus_point_uid]).to eq(data)
    end

    it "should return a 404 if the requested Question is not found" do
      put :update_focus_point, id: 'doesnotexist', fp_id: 'doesnotexist'
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end

    it "should return a 404 if the requested Question does not have the specified focusPoint" do
      put :update_focus_point, id: question.uid, fp_id: 'doesnotexist'
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#update_all_focus_points" do
    it "should replace all focusPoints" do
      data = {"foo" => "bar"}
      put :update_all_focus_points, id: question.uid, question: data
      question.reload
      expect(question.data["focusPoints"]).to eq(data)
    end

    it "should return a 404 if the requested Question is not found" do
      put :update_all_focus_points, id: 'doesnotexist'
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#destroy_focus_point" do
    it "should delete the focus point" do
      focus_point_uid = question.data["focusPoints"].keys.first
      pre_delete_count = question.data["focusPoints"].keys.length
      delete :destroy_focus_point, id: question.uid, fp_id: focus_point_uid
      question.reload
      expect(question.data["focusPoints"].keys.length).to eq(pre_delete_count - 1)
    end

    it "should return a 404 if the requested Question is not found" do
      delete :destroy_focus_point, id: 'doesnotexist', fp_id: 'doesnotexist'
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#update_flag" do
    it "should update the flag attribute in the data" do
      new_flag = 'newflag'
      put :update_flag, id: question.uid, question: {flag: new_flag}
      question.reload
      expect(question.data["flag"]).to eq(new_flag)
    end

    it "should return a 404 if the requested Question is not found" do
      put :update_flag, id: 'doesnotexist', question: {flag: nil}
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#update_model_concept" do
    it "should update the model concept uid attribute in the data" do
      new_model_concept = SecureRandom.uuid
      put :update_model_concept, id: question.uid, question: {modelConcept: new_model_concept}
      question.reload
      expect(question.data["modelConceptUID"]).to eq(new_model_concept)
    end

    it "should return a 404 if the requested Question is not found" do
      put :update_flag, id: 'doesnotexist', question: {flag: nil}
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#create_incorrect_sequence" do
    it "should add a new incorrect sequence to the question data" do
      data = {"foo" => "bar"}
      incorrect_sequence_count = question.data["incorrectSequences"].keys.length
      post :create_incorrect_sequence, id: question.uid, question: data
      question.reload
      expect(question.data["incorrectSequences"].keys.length).to eq(incorrect_sequence_count + 1)
    end
  end

  describe "#update_incorrect_sequence" do
    it "should update an existing incorrect sequence in the question data" do
      data = {"foo" => "bar"}
      incorrect_sequence_uid = question.data["incorrectSequences"].keys.first
      put :update_incorrect_sequence, id: question.uid, is_id: incorrect_sequence_uid, question: data
      question.reload
      expect(question.data["incorrectSequences"][incorrect_sequence_uid]).to eq(data)
    end

    it "should return a 404 if the requested Question is not found" do
      put :update_incorrect_sequence, id: 'doesnotexist', is_id: 'doesnotexist'
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end

    it "should return a 404 if the requested Question does not have the specified focusPoint" do
      put :update_incorrect_sequence, id: question.uid, is_id: 'doesnotexist'
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#update_all_incorrect_sequences" do
    it "should replace all incorrectSequences" do
      data = {"foo" => "bar"}
      put :update_all_incorrect_sequences, id: question.uid, question: data
      question.reload
      expect(question.data["incorrectSequences"]).to eq(data)
    end

    it "should return a 404 if the requested Question is not found" do
      put :update_all_incorrect_sequences, id: 'doesnotexist'
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end
end
