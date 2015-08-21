require 'rails_helper'

describe Api::V1::ActivitiesController, :type => :controller do

  context 'GET #show' do
    include_context "calling the api"

    before do
      @activity1 = FactoryGirl.create(:activity)

      get :show, format: :json, id: @activity1.uid
      @parsed_body = JSON.parse(response.body)
    end

    # it_behaves_like "an api request"

    it 'responds with 200' do
      expect(response.status).to eq(200)
    end

    # it "should have an object at it's root" do
    #   expect(@parsed_body.keys).to include('status')
    # end
    #
    # it "should present a uid" do
    #   expect(@parsed_body['object']['uid']).to eq(@activity1.uid)
    # end
  end

  context 'PUT #update' do
    include_context "calling the api" # this handles the doorkeeper auth

    let!(:activity) { FactoryGirl.create(:activity) }

    before do
      put :update, format: :json, id: activity.uid, name: 'foobar'
      @parsed_body = JSON.parse(response.body)
    end

    it_behaves_like 'an api request'

    it 'responds with 200' do
      expect(response.status).to eq(200)
    end
  end

  context 'when not authenticated via OAuth' do
    it 'POST #create returns 401 Unauthorized' do
      post :create, format: :json
      expect(response.status).to eq(401)
    end

    it 'PUT #update returns 401 Unauthorized' do
      activity = FactoryGirl.create(:activity)
      put :update, format: :json, id: activity.uid
      expect(response.status).to eq(401)
    end

    it 'DELETE #destroy returns 401 Unauthorized' do
      activity = FactoryGirl.create(:activity)
      delete :destroy, format: :json, id: activity.uid
      expect(response.status).to eq(401)
    end
  end
end
