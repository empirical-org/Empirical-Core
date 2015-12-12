require 'rails_helper'

describe ActivitySessionsController, type: :controller do
  let!(:activity) { FactoryGirl.create(:activity) }
  let!(:teacher) { FactoryGirl.create(:user) }
  let!(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }
  let!(:user1) { FactoryGirl.create(:user, classcode: classroom.code) }
  let!(:ca) { FactoryGirl.create(:classroom_activity, classroom: classroom, activity: activity) }
  let!(:activity_session) { FactoryGirl.create(:activity_session, user: user1, activity: activity, classroom_activity: ca, state: 'unstarted') }

  describe '#show' do
    let!(:user2) { FactoryGirl.create(:user) }

    def subject
      get :play, id: activity_session.id
    end

    def login_user(user)
      session[:user_id] = user.id
    end

    context 'user is not logged in' do
      before do
        subject
      end

      it 'returns 401 Unauthorized' do
        expect(response.status).to eq(401)
      end
    end

    context 'current_user != activity_session.user' do
      before do
        login_user(user2)
        subject
      end

      it 'returns 401 Unauthorized' do
        expect(response.status).to eq(401)
      end
    end

    context 'current_user == activity_session.user' do
      before do
        login_user(user1)
        subject
      end

      it 'responds with 200' do
        expect(response.status).to eq(200)
      end
    end
  end

  describe 'PUT' do
    it 'should start the activity session' do
      expect(activity_session.started_at).to be_nil
      put :update, id: activity_session.id
      expect(activity_session.reload.started_at).to_not be_nil
      expect(response).to be_redirect
    end
  end
end
