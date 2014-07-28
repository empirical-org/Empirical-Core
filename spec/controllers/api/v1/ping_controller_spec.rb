require 'spec_helper'

describe Api::V1::PingController do
  describe 'GET #show' do
    it 'responds with 200' do
      get :show, format: :json
      response.status.should eq(200)
    end
  end
end
