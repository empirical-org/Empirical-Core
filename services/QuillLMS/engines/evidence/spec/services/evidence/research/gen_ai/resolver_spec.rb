# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe Resolver do
        subject { described_class.run(feedback:) }

        context 'when feedback is nil' do
          let(:feedback) { nil }

          it { is_expected.to eq nil }
        end

        context 'when feedback has no marker' do
          let(:feedback) { 'This is feedback.' }

          it { is_expected.to eq feedback }
        end

        context 'when feedback contains a marker' do
          let(:marker) { described_class::FEEDBACK_MARKER }
          let(:text) { 'This is feedback.' }
          let(:feedback) { "Response: This is response. \n#{marker} #{text}" }

          it { is_expected.to eq text }
        end
      end
    end
  end
end
