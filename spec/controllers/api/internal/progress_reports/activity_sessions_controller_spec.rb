require 'rails_helper'

describe Api::Internal::ProgressReports::ActivitySessionsController, :type => :controller do

  context 'GET #index' do
    before do
      10.times { FactoryGirl.create(:activity_session) }
    end

    it 'works' do
      get :index
      expect(response.status).to eq(200)
      json = JSON.parse(response.body)
      expect(json['activity_sessions'].size).to eq(10)
      expect(json['activity_sessions'][0].keys).to match_array(['id', 'activity_classification_name'])
    end
  end
end