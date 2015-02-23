require 'rails_helper'

describe Teachers::ProgressReports::ActivitySessionsController, :type => :controller do
  render_views

  describe 'GET #index' do
    let(:teacher) { FactoryGirl.create(:teacher) }
    let(:classroom) { FactoryGirl.create(:classroom_with_one_student, teacher: teacher) }
    let(:classroom_activity) { FactoryGirl.create(:classroom_activity, classroom: classroom, unit: classroom.units.first) }
    let(:activity_session) { FactoryGirl.create(:activity_session, 
                                                state: 'finished',
                                                classroom_activity: classroom_activity) }

    before do
      session[:user_id] = teacher.id # sign in, is there a better way to do this in test?
    end

    it 'displays the html' do
      get :index, {}
      expect(response.status).to eq(200)
    end
  end

  let!(:current_teacher) { FactoryGirl.create(:teacher) }
  let!(:current_teacher_student) { FactoryGirl.create(:student) }
  let!(:current_teacher_classroom) { FactoryGirl.create(:classroom, teacher: current_teacher, students: [current_teacher_student]) }
  let!(:current_teacher_classroom_activity) { FactoryGirl.create(:classroom_activity_with_activity, classroom: current_teacher_classroom)}

  context 'XHR GET #index' do
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

      it 'fetches a list of activity sessions' do
        xhr :get, :index
        expect(response.status).to eq(200)
        json = JSON.parse(response.body)
        expect(json['activity_sessions'].size).to eq(10)
      end
    end
  end

end
