# frozen_string_literal: true

require 'rails_helper'

RSpec.describe OpenAI::Translate, type: :service do
  subject { described_class.new(english_text:, prompt:) }

  let(:prompt) { 'Translate this please!' }
  let(:english_text) { 'some prompt' }

  context 'test endpoint', external_api: true do
    it { expect { subject.run }.not_to raise_error }
  end

  context 'test request body' do
    let(:endpoint) { 'https://api.openai.com/v1/chat/completions' }
    let(:content) { 'a text response' }
    let(:body) do
      {
        "id": 'chatcmpl-123',
        "object": 'chat.completion',
        "created": 1677652288,
        "model": 'gpt-4-turbo-2024-04-09',
        "system_fingerprint": 'fp_44709d6fcb',
        "choices": [{
          "index": 0,
          "message": {
            "role": 'assistant',
            "content": content
          },
          "logprobs": nil,
          "finish_reason": 'stop'
        }],
        "usage": {
          "prompt_tokens": 9,
          "completion_tokens": 12,
          "total_tokens": 21
        }
      }.to_json
    end

    let(:headers) { { content_type: 'application/json' } }

    before { stub_request(:post, endpoint).to_return(body:, headers:) }

    it { expect(subject.run).to eq content }
  end

  describe 'system_prompt' do
    subject { translate.system_prompt }

    let(:translate) { described_class.new(english_text:,prompt:) }

    let(:english_text) { Faker::Quotes::Shakespeare.romeo_and_juliet }

    it { expect(subject).to eq prompt + english_text}
  end
end
