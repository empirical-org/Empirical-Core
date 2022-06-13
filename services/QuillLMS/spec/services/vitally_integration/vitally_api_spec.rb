# frozen_string_literal: true

require 'rails_helper'

describe VitallyApi do
  let(:api)  { VitallyApi.new }

  describe '#batch' do
    it 'should post the payload to the batch endpoint' do
      mock_payload = 'payload'
      expect(api).to receive(:send).with('batch', mock_payload)
      api.batch(mock_payload)
    end

    it 'should make a POST call to the Vitally API with the specified command and payload' do
      ENV['VITALLY_API_KEY'] = 'test api key'
      payload = 'test payload'
      expect(HTTParty).to receive(:post).with("#{VitallyApi::VITALLY_API_BASE_URL}/batch",
        headers: {
          Authorization: "Basic #{ENV['VITALLY_API_KEY']}",
          "Content-Type": "application/json"
        },
        body: payload.to_json
      )
      api.batch(payload)
    end
  end

  describe '#unlink' do
    it 'should post the payload to the unlink endpoint' do
      mock_payload = 'payload'
      expect(api).to receive(:send).with('unlink', mock_payload)
      api.unlink(mock_payload)
    end

    it 'should make a POST call to the Vitally API with the specified command and payload' do
      ENV['VITALLY_API_KEY'] = 'test api key'
      payload = 'test payload'
      expect(HTTParty).to receive(:post).with("#{VitallyApi::VITALLY_API_BASE_URL}/unlink",
        headers: {
          Authorization: "Basic #{ENV['VITALLY_API_KEY']}",
          "Content-Type": "application/json"
        },
        body: payload.to_json
      )
      api.unlink(payload)
    end
  end
end
