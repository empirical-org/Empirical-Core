# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(OpenAI::SentenceCompletion, type: :model) do
    let(:prompt) { 'some prompt' }
    let(:temperature) { 0.9 }
    let(:count) { 10 }
    let(:model_key) { :curie }
    let(:options) {{key: 'value'}}
    let(:endpoint) {'https://api.openai.com/v1/completions'}

    let(:sample_response_body) do
      {
        'id'=>'cmpl-5Yiq2oA2mneJK4GHLRBIYJ3Nm8oa2',
        'object'=>'text_completion',
        'created'=>1658957194,
        'model'=>'text-ada-001',
        'choices'=> [
          {'text'=>'a text response',
          'index'=>0,
          'logprobs'=>nil,
          'finish_reason'=>'length'},
          {'text'=>' they value their privacy and idea of stigmaly manury', 'index'=>1, 'logprobs'=>nil, 'finish_reason'=>'stop'},
          {'text'=>' they are working too hard and becoming too popular', 'index'=>2, 'logprobs'=>nil, 'finish_reason'=>'stop'}
        ]
      }

    end
    # include headers in response for proper parsing by HTTParty
    let(:sample_response) { {body: sample_response_body.to_json, headers: {content_type: 'application/json'}} }

    let(:completion) { described_class.new(prompt:, temperature:, count:, model_key:, options:) }

    describe '#new' do
      it 'should initialize as expected' do
        expect(completion.prompt).to eq(prompt)
        expect(completion.temperature).to eq(temperature)
        expect(completion.count).to eq(count)
        expect(completion.model_key).to eq(model_key)
        expect(completion.options).to eq(options)
      end
    end

    describe '#run' do
      it 'should post to OpenAI, populate response, and return a cleaned_response' do
        stub_request(:post, endpoint).to_return(sample_response)

        response = completion.run
        expect(response.count).to be(3)
        expect(response.class).to be(Array)
        expect(response[0]).to eq('a text response')
        expect(completion.response.class).to be(HTTParty::Response)

        request_body = JSON.parse(completion.response.request.options[:body])
        # ensure correct body was sent
        expect(request_body['model']).to eq('text-curie-001')
        expect(request_body['temperature']).to eq(temperature)
        expect(request_body['prompt']).to eq(prompt)
        expect(request_body['n']).to eq(count)
        expect(request_body['max_tokens']).to eq(Evidence::OpenAI::SentenceCompletion::MAX_TOKENS)
        expect(request_body['stop']).to eq(Evidence::OpenAI::SentenceCompletion::STOP_TOKENS)
      end
    end

    describe '#cleaned_results' do
      let(:response_with_chars) {["  -\n\n\n 1) Hello there[] you 2) person = \n other stuff to drop"]}

      it 'should strip out special characters and drop after middle newline' do
        expect(completion).to receive(:result_texts).and_return(response_with_chars)

        expect(completion.cleaned_results.first).to eq('Hello there you  person')
      end
    end
  end
end
