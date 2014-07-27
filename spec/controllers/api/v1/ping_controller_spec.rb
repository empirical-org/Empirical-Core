require 'spec_helper'

describe Api::V1::PingController do
  describe 'GET #index' do
    let(:token) { double :accessible? => true }

    before do
      #controller.stub(:doorkeeper_token) { token }
      allow(controller).to receive(:doorkeeper_token) {token} # => RSpec 3
    end

    it 'responds with 200' do
      get :show, format: :json
      response.status.should eq(200)
    end
  end
end
