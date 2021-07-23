require 'rails_helper'

RSpec.describe Api::V1::AppSettingsController, type: :controller do
  let(:user) { create(:user) }
  before do 
    allow(controller).to receive(:current_user) { user }
  end

  describe "GET #index" do
    it "returns a success response" do
      
      create(:app_setting, name: 'first', enabled: true) 
      create(:app_setting, name: 'second', enabled: true) 
      create(:app_setting, name: 'third', enabled: true) 

      get(:index) 
      
      expect(response).to be_success
      expected_keys = Set["first", "second", "third"]
      expect(Set[*JSON.parse(response.body).keys]).to eq expected_keys
    end
  end

  describe "GET #show" do
    it "returns a success response" do
      create(:app_setting, name: 'lorem', enabled: false)
      
      get(:show, params: { name: 'lorem' }) 
      
      expect(response).to be_success
      expect(JSON.parse(response.body)).to eq({ "lorem" => false })
    end
  end
end
