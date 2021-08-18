require 'rails_helper'

describe Api::V1::LessonsTokensController do
  describe '#create' do

    before { allow_any_instance_of(CreateLessonsToken).to receive(:call) { "token" } }

    it 'should render the token' do
      post :create, as: :json
      expect(response.body).to eq({token: "token"}.to_json)
    end
  end
end
