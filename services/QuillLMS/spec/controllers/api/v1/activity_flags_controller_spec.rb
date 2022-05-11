# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::ActivityFlagsController, type: :controller do
  context '#index' do
    it 'returns appropriate flags' do
      get :index, as: :json

      expect(JSON.parse(response.body)['activity_flags']).to match_array(Flags::FLAGS)
    end
  end
end
