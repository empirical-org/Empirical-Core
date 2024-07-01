# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe LLMFeedbackResolver do
        subject { described_class.run(raw_text:) }

        context 'when raw_text is nil' do
          let(:raw_text) { nil }

          it { expect { subject }.to raise_error(described_class::NilRawTextError) }
        end

        context 'when raw_text is blank' do
          let(:raw_text) { '' }

          it { expect { subject }.to raise_error(described_class::BlankRawTextError) }
        end

        context 'when raw_text is invalid JSON' do
          let(:raw_text) { 'invalid json' }

          it { expect { subject }.to raise_error(described_class::InvalidJSONError) }
        end

        context 'when raw_text is a feedback' do
          let(:feedback) { 'This is feedback' }
          let(:raw_text) { { response: 'this is a response', feedback: }.to_json }

          it { is_expected.to eq feedback }
        end

        context 'when raw_text is properties_feedback' do
          let(:feedback) { 'This is feedback' }
          let(:raw_text) { { type: 'object', properties: { feedback: } }.to_json }

          it { is_expected.to eq feedback }
        end

        context 'when raw_text is properties_feedback_value' do
          let(:feedback) { 'This is feedback' }
          let(:raw_text) { { type: 'object', properties: { feedback: { type: 'string', value: feedback } } }.to_json }

          it { is_expected.to eq feedback }
        end

        context 'when raw_text is an properties_feedback_enum' do
          let(:sentence1) { 'feedback1' }
          let(:sentence2) { 'feedback2' }
          let(:feedback) { "#{sentence1} #{sentence2}" }
          let(:raw_text) { { type: 'object', properties: { feedback: { type: 'string', enum: [sentence1, sentence2] } } }.to_json }

          it { is_expected.to eq feedback }
        end

        context 'when raw_text has unknown JSON structure' do
          let(:raw_text) { { unknown_unpredictable_key: 'unknown structure' }.to_json }

          it 'raises UnknownJSONStructureError' do
            expect { subject }.to raise_error(described_class::UnknownJSONStructureError)
          end
        end
      end
    end
  end
end
