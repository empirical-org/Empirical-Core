require 'rails_helper'

describe ActivitySessionsController, type: :controller do



  let!(:activity) { FactoryBot.create(:activity) }
  let!(:teacher) { FactoryBot.create(:user) }
  let!(:classroom) { FactoryBot.create(:classroom, teacher: teacher)}
  let!(:user1) { FactoryBot.create(:user, classcode: classroom.code) }
  let!(:ca) { FactoryBot.create(:classroom_activity, classroom: classroom, activity: activity)}
  let!(:activity_session) { FactoryBot.create(:activity_session, user: user1, activity: activity, classroom_activity: ca, state: 'unstarted') }

  describe '#show' do

    let!(:user2) { FactoryBot.create(:user) }

    def subject
      get :play, {id: activity_session.id}
    end

    def login_user user
      session[:user_id] = user.id
    end

    context 'user is not logged in' do

      before do
        subject
      end

      it 'returns 404 Unauthorized' do
        expect(response.status).to eq(404)
      end
    end

    context 'current_user != activity_session.user' do

      before do
        login_user(user2)
        subject
      end

      it 'returns 404 Not Found' do
        expect(response.status).to eq(404)
      end
    end

    context 'current_user == activity_session.user' do

      before do
        login_user(user1)
        subject
      end

      it 'responds with 302 redirect' do
        expect(response).to be_redirect
      end
    end
  end

end
