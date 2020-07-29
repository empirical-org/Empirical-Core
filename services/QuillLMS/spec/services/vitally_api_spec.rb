require 'rails_helper'

describe VitallyApi do
  describe '#batch' do
    it 'should post the payload to the batch endpoint' do
      api = VitallyApi.new
      mock_payload = 'payload'
      expect(api).to receive(:send).with('batch', mock_payload)
      api.batch(mock_payload)
    end
  end

  describe '#send' do
    it 'should make a POST call to the Vitally API with the specified command and payload' do
      ENV['VITALLY_API_KEY'] = 'test api key'
      payload = 'test payload'
      expect(HTTParty).to receive(:post).with("#{VitallyApi::VITALLY_API_BASE_URL}batch",
        headers: {
          Authorization: "Basic #{ENV['VITALLY_API_KEY']}",
          "Content-Type": "application/json"
        },
        body: payload.to_json
      )
      api = VitallyApi.new
      # "send" is a private method, so we get to it through the public "batch" method
      api.batch(payload)         
    end
  end
end
