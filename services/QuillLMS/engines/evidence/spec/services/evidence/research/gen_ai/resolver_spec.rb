# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe Resolver do
        subject { described_class.run(raw_text:) }

        context 'when raw_text is nil' do
          let(:raw_text) { nil }

          it { expect { subject }.to raise_error(described_class::NilFeedbackError) }
        end

        context 'when raw_text is empty' do
          let(:raw_text) { '' }

          it { expect { subject }.to raise_error(described_class::EmptyFeedbackError) }
        end

        context 'when raw_text is a simple feedback' do
          let(:feedback) { 'This is feedback' }
          let(:raw_text) { { response: 'this is a response', feedback: }.to_json }

          it { is_expected.to eq feedback }
        end

        context 'when raw_text is an enumerated feedback' do
          let(:sentence1) { 'feedback1' }
          let(:sentence2) { 'feedback2' }
          let(:feedback) { "#{sentence1} #{sentence2}" }
          let(:raw_text) { { type: 'object', properties: { feedback: { type: 'string', enum: [sentence1, sentence2] } } }.to_json }

          it { is_expected.to eq feedback }
        end
      end
    end
  end
end
