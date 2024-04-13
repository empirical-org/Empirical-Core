# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe Resolver do
        subject { described_class.run(feedback:) }

        context 'when feedback is nil' do
          let(:feedback) { nil }

          it { expect { subject }.to raise_error(described_class::NilFeedbackError) }
        end

        context 'when feedback is empty' do
          let(:feedback) { '' }

          it { expect { subject }.to raise_error(described_class::EmptyFeedbackError) }
        end

        context 'when feedback has no marker' do
          let(:feedback) { 'This is feedback.' }

          it { expect(subject).to eq(feedback) }
        end

        context 'when feedback contains a marker' do
          let(:marker) { described_class::FEEDBACK_MARKER }
          let(:text) { 'This is feedback.' }
          let(:feedback) { "Response: This is response. \n#{marker} #{text}" }

          it { expect(subject).to eq(text) }
        end

        context 'when feedback is present but text after the marker is blank' do
          let(:feedback) { "#{described_class::FEEDBACK_MARKER}    " }

          it { expect { subject }.to raise_error(described_class::BlankTextError, "Feedback provided: '#{feedback}'") }
        end
      end
    end
  end
end
