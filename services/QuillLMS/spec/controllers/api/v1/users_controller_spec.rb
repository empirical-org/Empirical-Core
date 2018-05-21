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
        text: "Hi"
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
end