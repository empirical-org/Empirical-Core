require 'rails_helper'

describe Api::V1::UsersController do
  let(:user) { create(:user) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#index' do
    it 'should return the correct json' do
      get :index, format: :json
      expect(response.body).to eq({
        user: user,
        text: "Hi",
        has_refresh_token: false,
        refresh_token_expires_at: nil
      }.to_json)
    end
  end

  describe '#current_user_and_coteachers' do
    let!(:teacher) { create(:teacher) }

    before do
      allow(ActiveRecord::Base.connection).to receive(:execute).and_return([teacher])
    end

    it 'should return the correct json' do
      get :current_user_and_coteachers, format: :json
      expect(response.body).to eq({
        user: user,
        coteachers: [teacher]
      }.to_json)
    end
  end
  describe '#current_user_role' do
    it 'should return teacher for teacher users' do
      user = create(:teacher)
      allow(controller).to receive(:current_user) { user }
      get :current_user_role, format: :json
      expect(response.body).to eq({ role: "teacher" }.to_json)
    end
    it 'should return admin for admin users' do
      user = create(:admin)
      allow(controller).to receive(:current_user) { user }
      get :current_user_role, format: :json
      expect(response.body).to eq({ role: "admin" }.to_json)
    end
    it 'should return student for student users' do
      user = create(:student)
      allow(controller).to receive(:current_user) { user }
      get :current_user_role, format: :json
      expect(response.body).to eq({ role: "student" }.to_json)
    end
    it 'should return nil if current_user is nil' do
      user = nil
      allow(controller).to receive(:current_user) { user }
      get :current_user_role, format: :json
      expect(response.body).to eq({ role: nil }.to_json)
    end
  end
end
