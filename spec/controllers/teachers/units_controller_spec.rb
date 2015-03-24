require 'spec_helper'

describe Teachers::UnitsController, type: :controller do
  let!(:teacher) { FactoryGirl.create(:teacher) }
  let!(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }

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
    let!(:unit) {FactoryGirl.create(:unit)}
    let!(:classroom_activity) {FactoryGirl.create(:classroom_activity, due_date: Time.now, unit: unit, classroom: classroom, activity: activity)}

    it 'includes classrooms' do
      post :index
      x = JSON.parse(response.body)
      expect(x['units'][0]['classrooms']).to_not be_empty
    end
  end
end