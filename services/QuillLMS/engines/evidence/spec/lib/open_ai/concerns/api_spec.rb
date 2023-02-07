# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(OpenAI::Concerns::API, type: :model) do

    let(:endpoint) {'https://api.openai.com/v1/some_endpoint'}
    let(:sample_response_body) {{"key"=>"value"}}

    # include headers in response for proper parsing by HTTParty
    let(:sample_response) { {body: sample_response_body.to_json, headers: {content_type: 'application/json'}} }

    let(:class_without_defined_methods) do
      Class.new do
        include Evidence::OpenAI::Concerns::API
      end
    end

    let(:class_with_methods) do
      Class.new do
        include Evidence::OpenAI::Concerns::API

        def request_body
          {}
        end
        def endpoint
          '/some_endpoint'
        end
        def cleaned_results
          response.body
        end
      end
    end

    context "#class_without_defined_methods" do
      it "should raise an error on run" do
        expect{class_without_defined_methods.new.run}.to raise_error(NotImplementedError)
      end
    end

    context "#class_with_defined_methods" do
      it "should run" do
        stub_request(:post, endpoint).to_return(sample_response)
        expect(JSON.parse(class_with_methods.new.run)).to eq(sample_response_body)
      end
    end

    context "run with a timeout" do
      it "should rescue and return an empty array" do
        stub_request(:post, endpoint).to_timeout
        expect(class_with_methods.new.run).to eq([])
      end
    end
  end
end
