# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module OpenAI
    RSpec.describe Completion do
      Evidence::Research::GenAI::LLMConfig::OPEN_AI_VERSIONS.each do
        subject { described_class.new(prompt:, llm_config:) }

        let(:prompt) { 'some prompt' }
        let(:llm_config) { create(:evidence_research_gen_ai_llm_config, :open_ai, version:) }

        context 'test endpoint', external_api: true do
          it { expect { subject.run }.not_to raise_error }
        end

        context 'test request body' do
          let(:endpoint) { 'https://api.openai.com/v1/chat/completions' }
          let(:content) { 'a text response' }
          let(:body) do
            {
              "id": "chatcmpl-123",
              "object": "chat.completion",
              "created": 1677652288,
              "model": version,
              "system_fingerprint": "fp_44709d6fcb",
              "choices": [{
                "index": 0,
                "message": {
                  "role": "assistant",
                  "content": content
                },
                "logprobs": nil,
                "finish_reason": "stop"
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
      end
    end
  end
end
