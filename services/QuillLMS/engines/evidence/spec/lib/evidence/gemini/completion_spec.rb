# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Gemini
    RSpec.describe Completion, external_api: true do
      Evidence::Research::GenAI::LLM::GOOGLE_VERSIONS.each do |version|
        let(:llm) { create(:evidence_research_gen_ai_llm, version:) }
        let(:prompt) { "Write the next word after this sentence: #{Faker::Quote.mitch_hedberg}" }

        describe 'rate limit error handling' do
          subject { described_class.new(llm:, prompt:, temperature:) }

          let(:endpoint) { subject.send(:endpoint) }
          let(:code) { 429 }
          let(:temperature) { 0 }

          let(:body) do
            {
              error: {
                code:,
                message: 'Resource has been exhausted (e.g., check quota).',
                status: 'RESOURCE_EXHAUSTED'
              }
            }.to_json
          end

          before do
            stub_const('Evidence::Gemini::Concerns::Api::MAX_RETRIES', 0)
            stub_const('Evidence::Gemini::Concerns::Api::MAX_ATTEMPTS', 0)
            stub_request(:post, endpoint).to_return(status: code, body:, headers: {})
          end

          it { expect { subject.run }.to raise_error Evidence::Gemini::Concerns::Api::MaxAttemptsError }
        end
      end
    end
  end
end
