# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(OpenAI::Edit, type: :model) do
    let(:input) { 'The weather is good today' }
    let(:temperature) { 0.9 }
    let(:instruction) {'Re-word the sentence'}
    let(:count) { 10 }
    let(:endpoint) {'https://api.openai.com/v1/edits'}
    let(:sample_response_body) do
      {
        "object"=>"edit",
        "created"=>1665765865,
        "choices"=>[
          {"text"=>"The weather is not bad today.\nThe sun is shining and the sky is blue.\n", "index"=>0},
          {"text"=>"The weather is good today.\nIt is sunny.\n", "index"=>1},
          {"text"=>"The weather is ok today.\nI want to go out to play.\n", "index"=>2}
        ],
        "usage"=>{"prompt_tokens"=>22, "completion_tokens"=>22, "total_tokens"=>44}
      }
    end
    # include headers in response for proper parsing by HTTParty
    let(:sample_response) { {body: sample_response_body.to_json, headers: {content_type: 'application/json'}} }

    subject { described_class.new(input: input, temperature: temperature, count: count, instruction: instruction) }


    describe "#new" do
      it "should initialize as expected" do
        expect(subject.input).to eq(input)
        expect(subject.temperature).to eq(temperature)
        expect(subject.count).to eq(count)
      end
    end

    describe "#run" do
      it "should post to OpenAI, populate response, and return a cleaned_response" do
        stub_request(:post, endpoint).to_return(sample_response)

        response = subject.run
        expect(response.count).to be(3)
        expect(response.class).to be(Array)
        expect(response[0]).to eq("The weather is not bad today.")
        expect(subject.response.class).to be(HTTParty::Response)

        request_body = JSON.parse(subject.response.request.options[:body])
        # ensure correct body was sent
        expect(request_body['model']).to eq('text-davinci-edit-001')
        expect(request_body['temperature']).to eq(temperature)
        expect(request_body['input']).to eq(input)
        expect(request_body['n']).to eq(count)
        expect(request_body['instruction']).to eq(instruction)
      end
    end

    describe "#cleaned_results" do
      let(:response_with_chars) {["  -\n\n\n 1) Hello there[] you 2) person = \n other stuff to drop"]}

      it "should strip out special characters and drop after middle newline" do
        expect(subject).to receive(:result_texts).and_return(response_with_chars)

        expect(subject.cleaned_results.first).to eq("Hello there you  person")
      end
    end
  end
end
