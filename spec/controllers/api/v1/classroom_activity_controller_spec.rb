require 'rails_helper'

describe Api::V1::ClassroomActivitiesController, type: :controller do
  let(:other_teacher) { FactoryGirl.create(:teacher) }
  let(:teacher) { FactoryGirl.create(:teacher) }
  let(:classroom_activity) {FactoryGirl.create(:classroom_with_classroom_activities, teacher_id: teacher.id)}



  context '#student_names' do

    it 'does not authenticate a teacher who does not own the classroom activity' do
        session[:user_id] = other_teacher.id
        get :student_names, id: classroom_activity.id, format: 'json'
        expect(response.status).to be_in([303, 404])
    end

    it 'authenticates a teacher who does own the classroom activity' do
        session[:user_id] = teacher.id
        get :student_names, id: classroom_activity.id, format: 'json'
        expect(response.status).not_to eq(303)
    end

    it 'returns JSON object with activity session name key values' do
        session[:user_id] = teacher.id
        get :student_names, id: classroom_activity.id, format: 'json'
        expect(JSON.parse(response.body)).to eq({"5"=>"Test User", "4"=>"Test User", "3"=>"Test User", "2"=>"Test User", "1"=>"Test User"})
    end
  end
end
