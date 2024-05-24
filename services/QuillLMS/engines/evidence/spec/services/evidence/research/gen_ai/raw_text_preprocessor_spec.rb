# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe RawTextPreprocessor do
        subject { described_class.run(raw_text:) }

        let(:fixed_text) { '{"key1":"val2"}' }

        context 'raw text has random newlines' do
          let(:raw_text) { "```json\n{\"key1\":\"val2\"}\n``` \n" }

          it { is_expected.to eq fixed_text }
        end


        context 'wrapped in Feedback preamble' do
          let(:raw_text) { 'Feedback: {"key1":"val2"}' }

          it { is_expected.to eq fixed_text }
        end

        context 'wrapped in triple backticks and json preamble' do
          let(:raw_text) {"```json\n{\"key1\":\"val2\"}\n```"}

          it { is_expected.to eq fixed_text }
        end
      end
    end
  end
end
