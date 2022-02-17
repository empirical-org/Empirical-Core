# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::AppSettingsController, type: :controller do
  let(:user) { create(:user, role: 'staff') }

  before { allow(controller).to receive(:current_user) { user } }

  describe "GET #index" do
    it "returns a success response" do

      create(:app_setting, name: 'first', enabled: true)
      create(:app_setting, name: 'second', enabled: true)
      create(:app_setting, name: 'third', enabled: true)

      get :index, as: :json

      expect(response).to be_success
      expected_keys = Set["first", "second", "third"]
      expect(Set[*JSON.parse(response.body).keys]).to eq expected_keys
    end
  end

  describe 'GET #admin_show' do
    it "returns a success response" do
      user1 = create(:user, email: 'a@b.com')
      user2 = create(:user, email: 'c@d.com')

      create(:app_setting, name: 'lorem', enabled: false, user_ids_allow_list: [user1.id, user2.id])

      get :admin_show, params: { name: 'lorem' }, as: :json

      expect(response).to be_success
      expect(JSON.parse(response.body)['user_emails_in_allow_list']).to eq(%w(a@b.com c@d.com))
    end

    it 'should handle users with nil emails gracefully' do
      user1 = create(:user, email: 'a@b.com')
      user2 = create(:user, email: nil)

      create(:app_setting, name: 'lorem', enabled: false, user_ids_allow_list: [user1.id, user2.id])

      get :admin_show, params: { name: 'lorem' }, as: :json

      expect(response).to be_success
      expect(JSON.parse(response.body)['user_emails_in_allow_list']).to eq(%w(a@b.com))
    end

    it 'should return the names of users without emails' do
      user1 = create(:user, email: 'a@b.com')
      user2 = create(:user, name: 'No Email', email: nil)

      create(:app_setting, name: 'lorem', enabled: false, user_ids_allow_list: [user1.id, user2.id])

      get :admin_show, params: { name: 'lorem' }, as: :json

      expect(response).to be_success
      expect(JSON.parse(response.body)['user_emails_in_allow_list']).to eq(%w(a@b.com))
      expect(JSON.parse(response.body)['users_without_emails']).to eq([user2.name])
    end
  end


  describe "GET #show" do
    it "returns a success response" do
      create(:app_setting, name: 'lorem', enabled: false)

      get :show, params: { name: 'lorem' }, as: :json

      expect(response).to be_success
      expect(JSON.parse(response.body)).to eq({ "lorem" => false })
    end
  end
end
