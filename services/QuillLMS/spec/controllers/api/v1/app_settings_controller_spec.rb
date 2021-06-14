require 'rails_helper'

RSpec.describe API::V1::AppSettingsController, type: :controller do
  let(:user) { create(:user) }

  describe "GET #index" do
    it "returns a success response" do
      
      create(:app_setting, name: 'first', enabled: true) 
      create(:app_setting, name: 'second', enabled: true) 
      create(:app_setting, name: 'third', enabled: true) 

      get(:index, user_id: user.id) 
      
      expect(response).to be_success
      expected_keys = Set[%w(first second third)]
      expect(Set[*JSON.parse(response.body).keys]).to eq expected_keys
    end
  end

  describe "GET #show" do
    it "returns a success response" do
      create(:app_setting, name: 'lorem', enabled: false)
      
      get(:show, user_id: user.id, name: 'lorem') 
      
      expect(response).to be_success
      expect(JSON.parse(response.body)).to eq({ "lorem" => false })
    end
  end
end
