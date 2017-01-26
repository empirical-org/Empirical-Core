require 'spec_helper'
require 'rails_helper'

describe Teachers::UnitsController, type: :controller do
  let!(:teacher) { FactoryGirl.create(:teacher) }
  let!(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }
  let!(:unit) {FactoryGirl.create(:unit, user: teacher)}
  let!(:unit2) {FactoryGirl.create(:unit, user: teacher)}

  before do
      session[:user_id] = teacher.id # sign in, is there a better way to do this in test?
  end

  describe '#create' do
    it 'kicks off a background job' do
      expect {
        post :create, classroom_id: classroom.id,
                      unit: {
                        name: 'A Cool Learning Experience',
                        classrooms: [],
                        activities: []
                      }
        expect(response.status).to eq(200)
      }.to change(AssignActivityWorker.jobs, :size).by(1)
    end
  end

  describe '#index' do
    let!(:activity) {FactoryGirl.create(:activity)}
    let!(:classroom_activity) {FactoryGirl.create(:classroom_activity, due_date: Time.now, unit: unit, classroom: classroom, activity: activity)}

    it 'includes classrooms' do
      post :index
      x = JSON.parse(response.body)
      expect(x['units'][0]['classrooms']).to_not be_empty
    end
  end

  describe '#update' do

    it 'sends a 200 status code when a unique name is sent over' do
      put :update, id: unit.id,
                    unit: {
                      name: 'Super Unique Unit Name'
                    }
      expect(response.status).to eq(200)
    end

    it 'sends a 422 error code when a non-unique name is sent over' do
      put :update, id: unit.id,
                    unit: {
                      name: unit2.name
                    }
      expect(response.status).to eq(422)

    end
  end

  describe '#classrooms_with_students_and_classroom_activities returns' do
    it "the teacher's classrooms when it is passed a valid unit id" do
        get :classrooms_with_students_and_classroom_activities, id: unit.id
        expect(response.status).to eq(200)
    end

    it "422 error code when it is not passed a valid unit id" do
      get :classrooms_with_students_and_classroom_activities, id: Unit.count + 1000
      expect(response.status).to eq(422)
    end

  end



end
