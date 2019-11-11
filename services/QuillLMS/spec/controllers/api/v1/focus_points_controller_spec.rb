require 'json'
require 'rails_helper'

describe Api::V1::FocusPointsController, type: :controller do
  let!(:question) { create(:question) }

  describe "#index" do
    it "should return a list of Question Focus Points" do
      get :index, question_id: question.uid
      expect(JSON.parse(response.body)).to eq(question.data["focusPoints"])
    end

    it "should return a 404 if the requested Question is not found" do
      get :index, question_id: 'doesnotexist'
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#show" do
    it "should return the containing focus points object" do
      fp_id = question.data["focusPoints"].keys.first
      get :show, question_id: question.uid, id: fp_id
      expect(JSON.parse(response.body)).to eq(question.data["focusPoints"][fp_id])
    end

    it "should return a 404 if the requested Question is not found" do
      fp_id = question.data["focusPoints"].keys.first
      get :show, question_id: 'doesnotexist', id: fp_id
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end

    it "should return a 404 if the requested FocusPoint is not found" do
      get :show, question_id: question.id, id: "doesnotexist"
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#create" do
    it "should add a new focus point to the question data" do
      data = {"foo" => "bar"}
      focus_point_count = question.data["focusPoints"].keys.length
      post :create, question_id: question.uid, focus_point: data
      question.reload
      expect(question.data["focusPoints"].keys.length).to eq(focus_point_count + 1)
    end

    it "should return a 404 if the requested Question is not found" do
      get :index, question_id: 'doesnotexist'
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#update" do
    it "should update an existing focus point in the question data" do
      data = {"foo" => "bar"}
      focus_point_uid = question.data["focusPoints"].keys.first
      put :update, question_id: question.uid, id: focus_point_uid, focus_point: data
      question.reload
      expect(question.data["focusPoints"][focus_point_uid]).to eq(data)
    end

    it "should return a 404 if the requested Question is not found" do
      put :update, question_id: 'doesnotexist', id: 'doesnotexist'
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end

    it "should return a 404 if the requested Question does not have the specified focusPoint" do
      put :update, question_id: question.uid, id: 'doesnotexist'
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#destroy" do
    it "should delete the focus point" do
      focus_point_uid = question.data["focusPoints"].keys.first
      pre_delete_count = question.data["focusPoints"].keys.length
      delete :destroy, question_id: question.uid, id: focus_point_uid
      question.reload
      expect(question.data["focusPoints"].keys.length).to eq(pre_delete_count - 1)
    end

    it "should return a 404 if the requested Question is not found" do
      delete :destroy, question_id: 'doesnotexist', id: 'doesnotexist'
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#update_all" do
    it "should replace all focusPoints" do
      data = {"foo" => "bar"}
      put :update_all, question_id: question.uid, focus_point: data
      question.reload
      expect(question.data["focusPoints"]).to eq(data)
    end

    it "should return a 404 if the requested Question is not found" do
      put :update_all, question_id: 'doesnotexist'
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end
end
