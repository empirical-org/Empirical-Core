require 'rails_helper'

describe Api::V1::PingController, :type => :controller do
  describe 'GET #show' do
    it 'responds with 200' do
      get :show, format: :json
      expect(response.status).to eq(200)
    end
  end
end
