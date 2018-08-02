require 'rails_helper'

describe Api::V1::LessonsTokensController do
  describe '#create' do

    before do
      allow_any_instance_of(CreateLessonsToken).to receive(:create) { "token" }
    end

    it 'should render the token' do
      post :create, format: :json
      expect(response.body).to eq({token: "token"}.to_json)
    end
  end
end
