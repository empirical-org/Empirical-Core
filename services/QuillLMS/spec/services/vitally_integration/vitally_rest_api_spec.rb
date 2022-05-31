# frozen_string_literal: true

require 'rails_helper'

describe VitallyRestApi do
  let(:api)  { VitallyRestApi.new }

  describe '#create' do
    it 'should post the payload to the create endpoint' do
      mock_payload = 'payload'
      expect(api).to receive(:post).with('type', mock_payload)
      api.create('type', mock_payload)
    end

    it 'should make a POST call to the Vitally API with the specified command and payload' do
      ENV['VITALLY_REST_API_KEY'] = 'test api key'
      payload = 'test payload'
      expect(HTTParty).to receive(:post).with("#{VitallyRestApi::VITALLY_REST_API_BASE_URL}/type",
        headers: {
          Authorization: "Basic #{ENV['VITALLY_REST_API_KEY']}",
          "Content-Type": "application/json"
        },
        body: payload.to_json
      )
      api.create('type', payload)
    end
  end
end
