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

      it 'should raise error on timeout' do
        stub_request(:post, mock_endpoint).to_timeout

        expect { client.post }.to raise_error(Evidence::Opinion::Client::APITimeoutError, "request took longer than 5 seconds")
      end
    end
  end
end
