# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Gemini
    RSpec.describe Completion, external_api: true do
      %w[gemini-1.0-pro gemini-1.5-pro-latest].each do |version|
        subject { described_class.run(llm_config:, prompt:) }

        let(:llm_config) { create(:evidence_research_gen_ai_llm_config, version:) }
        let(:prompt) { "Write the next word after this sentence: #{Faker::Quote.mitch_hedberg}" }

        it { is_expected.to be_a String }
      end
    end
  end
end
