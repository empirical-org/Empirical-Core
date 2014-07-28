require 'spec_helper'

describe Api::V1::ActivitiesController, :type => :controller do
  render_views

  describe 'GET #index' do
    let!(:application) { Doorkeeper::Application.create!(:name => "MyApp", :redirect_uri => "http://app.com") }
    let!(:user) { create(:user) }
    let!(:token) { Doorkeeper::AccessToken.create! :application_id => application.id, :resource_owner_id => user.id }

    before do
      allow(controller).to receive(:doorkeeper_token) {token}
      @activity1 = create(:activity)
      @activity2 = create(:activity)
    end

    it 'responds with 200' do
      get :index, format: :json

      expect(response.status).to eq(200)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body.first['id']).to eq(@activity1.id)
      expect(parsed_body.last['id']).to eq(@activity2.id)
    end
  end
end
