require 'rails_helper'

describe Api::V1::ActivityFlagsController, type: :controller do
  context '#index' do
    it 'returns appropriate flags' do
      get :index
      expect(JSON.parse(response.body)['activity_flags']).to match_array(%w(production, archived, alpha, beta))
    end
  end
end