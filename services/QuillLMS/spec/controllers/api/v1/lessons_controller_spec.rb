# frozen_string_literal: true

require 'json'
require 'rails_helper'

describe Api::V1::LessonsController, type: :controller do
  let!(:activity) { create(:connect_activity) }
  let!(:question) { create(:question) }

  describe "#index" do
    it "should return a list of Lessons" do
      get :index, params: { lesson_type: "connect_lesson" }, as: :json
      expect(JSON.parse(response.body).keys.length).to eq(1)
    end

    it "should include the response from the db" do
      get :index, params: { lesson_type: "connect_lesson" }, as: :json
      expect(JSON.parse(response.body).keys.first).to eq(activity.uid)
    end
  end

  describe "#show" do
    it "should return the specified lesson" do
      get :show, params: { id: activity.uid }, as: :json
      expect(JSON.parse(response.body)).to eq(activity.data)
    end

    it "should return a 404 if the requested Lesson is not found" do
      get :show, params: { id: 'doesnotexist' }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#create" do
    it "should create a new Lesson record" do
      uuid = SecureRandom.uuid
      data = {foo: "bar", name: "name", flag: "alpha"}
      expect(SecureRandom).to receive(:uuid).and_return(uuid)
      pre_create_count = Activity.count
      post :create, params: { lesson_type: "connect_lesson", lesson: data }, as: :json
      expect(Activity.count).to eq(pre_create_count + 1)
      expect(Activity.find_by(name: data[:name]).flag).to eq data[:flag].to_sym
    end
  end

  describe "#update" do
    it "should update the existing record" do
      data = {"foo" => "bar", "flag" => "alpha", "name" => "new name"}
      put :update, params: { id: activity.uid, lesson: data }, as: :json
      activity.reload
      expect(activity.data).to eq(data)
      expect(Activity.find_by(name: data["name"]).flag).to eq data["flag"].to_sym
    end

    it "should return a 404 if the requested Lesson is not found" do
      get :update, params: { id: 'doesnotexist' }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#destroy" do
    let(:staff) { create(:staff) }
    let(:teacher) { create(:teacher) }

    it "should destroy the existing record if the current user is staff" do
      allow(controller).to receive(:current_user).and_return(staff)
      delete :destroy, params: { id: activity.uid }, as: :json
      expect(Activity.where(uid: activity.uid).count).to eq(0)
    end

    it "should return a 404 if the requested Lesson is not found if the current user is staff" do
      allow(controller).to receive(:current_user).and_return(staff)
      delete :destroy, params: { id: 'doesnotexist' }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end

    it "should return a 403 if the current user is not staff" do
      allow(controller).to receive(:current_user).and_return(teacher)
      delete :destroy, params: { id: activity.uid }, as: :json
      expect(response.status).to eq(403)
      expect(response.body).to include("You are not authorized to access this resource")
    end
  end

  describe "#add_question" do
    it "should add a question to the existing record" do
      data = {"key" => question.uid, "questionType" => "questions"}
      put :add_question, params: { id: activity.uid, question: data }, as: :json
      activity.reload
      expect(activity.data["questions"]).to include(data)
    end

    it "should return a 404 if the requested Question is not found" do
      data = {"question" => {"key" => "notarealID", "questionType" => "question"}}
      put :add_question, params: { id: activity.uid, question: data }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include("does not exist")
    end
  end
end
