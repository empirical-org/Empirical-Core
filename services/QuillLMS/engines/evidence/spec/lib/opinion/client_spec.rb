# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(Opinion::Client) do
    context '#post' do
      let(:mock_endpoint) { 'https://www.opinion.com' }
      let(:client) { Opinion::Client.new(entry: '', prompt_text: '') }
      # include headers in response for proper parsing by HTTParty
      let(:sample_response) { {body: '{}', headers: {content_type: 'application/json'}} }

      before do
        stub_const("Evidence::Opinion::Client::API_ENDPOINT", mock_endpoint)
      end

      it "should process successfully" do
        stub_request(:post, mock_endpoint).to_return(sample_response)

        expect { client.post }.to_not raise_error
      end

      it 'should raise error if there is an error status' do
        errored_response = sample_response.merge(status: 500)
        stub_request(:post, mock_endpoint).to_return(errored_response)

        expect { client.post}.to raise_error(Evidence::Opinion::Client::APIError)
      end

      it 'should raise error if the retry fails' do
        allow(client).to receive(:api_request).and_raise(Net::ReadTimeout).twice
        expect { client.post }.to raise_error(Evidence::Opinion::Client::APITimeoutError)
      end

      it 'should process successfully on retry' do
        mock_response = double
        allow(mock_response).to receive(:success?).and_return true
        allow(mock_response).to receive(:filter).and_return []

        allow(client).to receive(:api_request).and_raise(Net::ReadTimeout).once
        allow(client).to receive(:api_request).and_return(mock_response).once

        expect { client.post }.to_not raise_error
      end

    end
  end
end
