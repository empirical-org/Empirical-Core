require 'json'
require 'rails_helper'

describe Api::V1::LessonsController, type: :controller do
  let!(:lesson) { create(:lesson) }

  describe "#index" do
    it "should return a list of Lessons" do
      get :index 
      expect(JSON.parse(response.body).keys.length).to eq(1)
    end

    it "should include the response from the db" do
      get :index
      expect(JSON.parse(response.body).keys.first).to eq(lesson.uid)
    end
  end

  describe "#show" do
    it "should return the specified lesson" do
      get :show, id: lesson.uid
      expect(JSON.parse(response.body)).to eq(lesson.data)
    end

    it "should return a 404 if the requested Lesson is not found" do
      get :show, id: 'doesnotexist'
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#create" do
    it "should create a new Lesson record" do
      uuid = SecureRandom.uuid
      data = {foo: "bar"}
      expect(SecureRandom).to receive(:uuid).and_return(uuid)
      pre_create_count = Lesson.count
      post :create, lesson: data
      expect(Lesson.count).to eq(pre_create_count + 1)
    end
  end

  describe "#update" do
    it "should update the existing record" do
      data = {"foo" => "bar"}
      put :update, id: lesson.uid, lesson: data
      lesson.reload
      expect(lesson.data).to eq(data)
    end

    it "should return a 404 if the requested Lesson is not found" do
      get :update, id: 'doesnotexist'
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end
end
