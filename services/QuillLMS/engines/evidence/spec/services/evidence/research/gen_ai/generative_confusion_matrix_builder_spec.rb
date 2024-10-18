# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe GenerativeConfusionMatrixBuilder, type: :service do
        subject { described_class.run(llm_examples:) }

        context 'when there are no llm feedbacks' do
          let(:llm_examples) { [] }

          it { is_expected.to eq [[0, 0], [0, 0]] }
        end

        context 'with test_optimal, llm_optimal' do
          let(:llm_examples) { [double(test_optimal?: true, optimal?: true)] }

          it { is_expected.to eq [[1, 0], [0, 0]] }
        end

        context 'with test_suboptimal, llm_optimal only' do
          let(:llm_examples) { [double(test_optimal?: true, optimal?: false)] }

          it { is_expected.to eq [[0, 1], [0, 0]] }
        end

        context 'with test_optimal, llm_suboptimal only' do
          let(:llm_examples) { [double(test_optimal?: false, optimal?: true)] }

          it { is_expected.to eq [[0, 0], [1, 0]] }
        end

        context 'with test_suboptimal, llm_suboptimal' do
          let(:llm_examples) { [double(test_optimal?: false, optimal?: false)] }

          it { is_expected.to eq [[0, 0], [0, 1]] }
        end

        context 'with mixed feedbacks' do
          let(:llm_examples) do
            [
              double(test_optimal?: true, optimal?: true),
              double(test_optimal?: true, optimal?: false),
              double(test_optimal?: false, optimal?: true),
              double(test_optimal?: false, optimal?: false)
            ]
          end

          it { is_expected.to eq [[1, 1], [1, 1]] }
        end
      end
    end
  end
end
