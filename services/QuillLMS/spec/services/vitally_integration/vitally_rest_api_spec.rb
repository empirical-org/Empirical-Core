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

  describe '#get' do
    it 'should make a GET call to the Vitally API with the specified type and ID' do
      id = 1
      type = 'type'
      ENV['VITALLY_REST_API_KEY'] = 'test api key'

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
      raise 'test not written'
    end

    it 'should return false if the Vitally REST API returns an object with an error' do
      raise 'test not written'
    end

    it 'should make a GET call to the Vitally API with the specified ID and payload' do
      id = 1
      type = 'type'
      ENV['VITALLY_REST_API_KEY'] = 'test api key'

      expect(HTTParty).to receive(:get).with("#{VitallyRestApi::VITALLY_REST_API_BASE_URL}/#{type}/#{id}",
        headers: {
          Authorization: "Basic #{ENV['VITALLY_REST_API_KEY']}",
          "Content-Type": "application/json"
        }
      )
      api.exists?(type, id)
    end
  end

  describe '#update' do
    it 'should make a PUT call to the Vitally API with the specified type, ID and payload' do
      id = 1
      type = 'type'
      payload = 'test payload'
      ENV['VITALLY_REST_API_KEY'] = 'test api key'

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
