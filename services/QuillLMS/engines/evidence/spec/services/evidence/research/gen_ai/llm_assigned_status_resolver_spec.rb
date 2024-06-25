# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe LLMAssignedStatusResolver do
        subject { described_class.run(raw_text:) }

        let(:feedback) { 'This is feedback' }

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

        context 'when raw_text is valid JSON but not a hash' do
          let(:raw_text) { '[]' }

          it { expect { subject }.to raise_error(described_class::RawTextIsNotHashError) }
        end

        context 'when raw_text is missing optimal key' do
          let(:raw_text) { { feedback: }.to_json }

          it { expect { subject }.to raise_error(described_class::MissingOptimalKeyError) }
        end

        context 'when raw_text has optimal key' do
          let(:raw_text) { { feedback:, optimal: }.to_json }

          context 'when optimal is true' do
            let(:optimal) { true }

            it { is_expected.to eq described_class::OPTIMAL }
          end

          context 'when optimal is false' do
            let(:optimal) { false }

            it { is_expected.to eq described_class::SUBOPTIMAL }
          end

          context 'when optimal is not a boolean' do
            let(:optimal) { 'not a boolean' }

            it { expect { subject }.to raise_error(described_class::MissingBooleanValueError) }
          end
        end
      end
    end
  end
end
