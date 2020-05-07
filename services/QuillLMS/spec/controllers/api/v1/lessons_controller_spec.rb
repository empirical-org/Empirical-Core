require 'json'
require 'rails_helper'

describe Api::V1::LessonsController, type: :controller do
  let!(:lesson) { create(:lesson) }
  let!(:question) { create(:question) }

  describe "#index" do
    it "should return a list of Lessons" do
      get :index, lesson_type: lesson.lesson_type
      expect(JSON.parse(response.body).keys.length).to eq(1)
    end

    it "should include the response from the db" do
      get :index, lesson_type: lesson.lesson_type
      expect(JSON.parse(response.body).keys.first).to eq(lesson.uid)
    end
  end

  describe "#show" do
    it "should return the specified lesson" do
      get :show, lesson_type: lesson.lesson_type, id: lesson.uid
      expect(JSON.parse(response.body)).to eq(lesson.data)
    end

    it "should return a 404 if the requested Lesson is not found" do
      get :show, lesson_type: lesson.lesson_type, id: 'doesnotexist'
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
      post :create, lesson_type: lesson.lesson_type, lesson: data
      expect(Lesson.count).to eq(pre_create_count + 1)
    end
  end

  describe "#update" do
    it "should update the existing record" do
      data = {"foo" => "bar"}
      put :update, lesson_type: lesson.lesson_type, id: lesson.uid, lesson: data
      lesson.reload
      expect(lesson.data).to eq(data)
    end

    it "should return a 404 if the requested Lesson is not found" do
      get :update, lesson_type: lesson.lesson_type, id: 'doesnotexist'
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#destroy" do
    let(:staff) { create(:staff) }
    let(:teacher) { create(:teacher) }

    it "should destroy the existing record if the current user is staff" do
      allow(controller).to receive(:current_user).and_return(staff)
      delete :destroy, lesson_type: lesson.lesson_type, id: lesson.uid
      expect(Lesson.where(uid: lesson.uid).count).to eq(0)
    end

    it "should return a 404 if the requested Lesson is not found if the current user is staff" do
      allow(controller).to receive(:current_user).and_return(staff)
      delete :destroy, lesson_type: lesson.lesson_type, id: 'doesnotexist'
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end

    it "should return a 403 if the current user is not staff" do
      allow(controller).to receive(:current_user).and_return(teacher)
      delete :destroy, lesson_type: lesson.lesson_type, id: lesson.uid
      expect(response.status).to eq(403)
      expect(response.body).to include("You are not authorized to access this resource")
    end
  end

  describe "#destroy" do
    let(:staff) { create(:staff) }
    let(:teacher) { create(:teacher) }

    it "should destroy the existing record if the current user is staff" do
      allow(controller).to receive(:current_user).and_return(staff)
      delete :destroy, lesson_type: lesson.lesson_type, id: lesson.uid
      expect(Lesson.where(uid: lesson.uid).count).to eq(0)
    end

    it "should return a 404 if the requested Lesson is not found if the current user is staff" do
      allow(controller).to receive(:current_user).and_return(staff)
      delete :destroy, lesson_type: lesson.lesson_type, id: 'doesnotexist'
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end

    it "should return a 403 if the current user is not staff" do
      allow(controller).to receive(:current_user).and_return(teacher)
      delete :destroy, lesson_type: lesson.lesson_type, id: lesson.uid
      expect(response.status).to eq(403)
      expect(response.body).to include("You are not authorized to access this resource")
    end
  end

  describe "#add_question" do
    it "should add a question to the existing record" do
      data = {"key" => question.uid, "questionType" => "questions"}
      put :add_question, lesson_type: lesson.lesson_type, id: lesson.uid, question: data
      lesson.reload
      expect(lesson.data["questions"]).to include(data)
    end

    it "should return a 404 if the requested Question is not found" do
      data = {"question" => {"key" => "notarealID", "questionType" => "question"}}
      put :add_question, lesson_type: lesson.lesson_type, id: lesson.uid, question: data
      expect(response.status).to eq(404)
      expect(response.body).to include("does not exist")
    end
  end
end
