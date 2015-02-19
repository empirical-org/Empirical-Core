require 'rails_helper'

describe Api::Internal::ProgressReports::ActivitySessionsController, :type => :controller do

  let!(:current_teacher) { FactoryGirl.create(:teacher) }
  let!(:current_teacher_student) { FactoryGirl.create(:student) }
  let!(:current_teacher_classroom) { FactoryGirl.create(:classroom, teacher: current_teacher, students: [current_teacher_student]) }
  let!(:current_teacher_classroom_activity) { FactoryGirl.create(:classroom_activity_with_activity, classroom: current_teacher_classroom)}

  context 'GET #index' do
    before do
      ActivitySession.destroy_all
      10.times { FactoryGirl.create(:activity_session, classroom_activity: current_teacher_classroom_activity, user: current_teacher_student) }
    end

    it 'requires a logged-in teacher' do
      get :index
      expect(response.status).to eq(401)
    end

    context 'when logged in' do
      before do
        session[:user_id] = current_teacher.id
      end

      it 'works' do
        get :index
        expect(response.status).to eq(200)
        json = JSON.parse(response.body)
        expect(json['activity_sessions'].size).to eq(10)
      end
    end
  end
end