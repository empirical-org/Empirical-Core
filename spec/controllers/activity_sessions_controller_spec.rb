require 'rails_helper'

describe ActivitySessionsController, type: :controller do



  describe '#show' do

    let!(:user1) { FactoryGirl.create(:user) }
    let!(:activity_session) { FactoryGirl.create(:activity_session, user: user1) }
    let!(:user2) { FactoryGirl.create(:user) }

    def subject
      get :show, {id: activity_session.id}
    end

    def login_user user
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

end