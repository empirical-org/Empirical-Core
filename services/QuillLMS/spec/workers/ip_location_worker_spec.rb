# frozen_string_literal: true

require 'rails_helper'

describe IpLocationWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:user) { create(:user) }
    let(:api_key) { '12345' }
    let(:api_base) { 'https://testurl.com' }
    let(:ip_address) {'12.34.56.78'}
    let(:api_url) { "#{api_base}/#{api_key}/json/#{ip_address}"}
    # This is needed for proper HTTParty stubbing
    let(:response_headers) { {content_type: 'application/json'} }

    before do
      stub_const('IpLocationWorker::API_KEY', api_key)
      stub_const('IpLocationWorker::BASE_URL', api_base)
    end

    context 'successful API response' do
      let(:response_body) {
        {
          "country_name" => "country",
          "region_name" => "region",
          "city_name" => "city",
          "postcode" => "110011",
        }.to_json
      }

      before do
        stub_request(:get, api_url)
          .to_return(status: 200, body: response_body, headers: response_headers)
      end

      it 'should create the ip location unless the location is in the given blacklist' do
        subject.perform(user.id, ip_address, [])

        expect(IpLocation.last.country).to eq "country"
        expect(IpLocation.last.state).to eq "region"
        expect(IpLocation.last.city).to eq "city"
        expect(IpLocation.last.zip).to eq 110011
        expect(IpLocation.last.user).to eq user
      end

      it 'should not create the ip location if it is in the given blacklist' do
        subject.perform(user.id, ip_address, ["110011"])
        expect(IpLocation.count).to eq 0
      end
    end

    context 'errored API response' do
      let(:response_body) { {"error"=>"Invalid API key"}.to_json}

      before do
        stub_request(:get, api_url)
          .to_return(status: 429, body: response_body, headers: response_headers)
      end

      it 'should raise a PinpointAPIError' do
        expect { subject.perform(user.id, ip_address) }.to(raise_error(IpLocationWorker::PinpointAPIError))
      end
    end
  end
end
