# frozen_string_literal: true

require 'rails_helper'

describe VitallyRestApi do
  let(:api)  { VitallyRestApi.new }

  before do
    stub_const('ENV', {'VITALLY_REST_API_KEY' => 'test api key'})
  end

  describe '#create' do
    it 'should make a POST call to the Vitally API with the specified command and payload' do
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

  describe '#get' do
    it 'should make a GET call to the Vitally API with the specified type and ID' do
      id = 1
      type = 'type'

      expect(HTTParty).to receive(:get).with("#{VitallyRestApi::VITALLY_REST_API_BASE_URL}/#{type}/#{id}",
        headers: {
          Authorization: "Basic #{ENV['VITALLY_REST_API_KEY']}",
          "Content-Type": "application/json"
        }
      )
      api.get(type, id)
    end
  end

  describe '#exists?' do
    it 'should return true if the Vitally REST API returns an object without an error' do
      api_get = double
      expect(api_get).to receive(:parsed_response).and_return({})
      expect(api).to receive(:get).and_return(api_get)

      expect(api.exists?('type', 1)).to eq(true)
    end

    it 'should return false if the Vitally REST API returns a parsed_response with an error' do
      api_get = double
      expect(api_get).to receive(:parsed_response).and_return({'error' => 'there is one'})
      expect(api).to receive(:get).and_return(api_get)

      expect(api.exists?('type', 1)).to eq(false)
    end

    it 'should make a GET call to the Vitally API with the specified ID and payload' do
      id = 1
      type = 'type'

      httparty_double = double
      expect(httparty_double).to receive(:parsed_response).and_return({})
      expect(HTTParty).to receive(:get).with("#{VitallyRestApi::VITALLY_REST_API_BASE_URL}/#{type}/#{id}",
        headers: {
          Authorization: "Basic #{ENV['VITALLY_REST_API_KEY']}",
          "Content-Type": "application/json"
        }
      ).and_return(httparty_double)
      api.exists?(type, id)
    end
  end

  describe '#update' do
    it 'should make a PUT call to the Vitally API with the specified type, ID and payload' do
      id = 1
      type = 'type'
      payload = 'test payload'

      expect(HTTParty).to receive(:put).with("#{VitallyRestApi::VITALLY_REST_API_BASE_URL}/#{type}/#{id}",
        headers: {
          Authorization: "Basic #{ENV['VITALLY_REST_API_KEY']}",
          "Content-Type": "application/json"
        },
        body: payload.to_json
      )
      api.update(type, id, payload)
    end
  end
end
