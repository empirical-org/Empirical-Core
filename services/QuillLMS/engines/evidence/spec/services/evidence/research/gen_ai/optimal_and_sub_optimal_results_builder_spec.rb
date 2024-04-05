# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe OptimalAndSubOptimalResultsBuilder, type: :service do
        subject { described_class.run(experiment) }

        let(:experiment) { create(:evidence_research_gen_ai_experiment) }

        before { allow(experiment).to receive(:llm_feedbacks).and_return(llm_feedbacks) }

        context 'when there are no llm feedbacks' do
          let(:llm_feedbacks) { [] }

          it { is_expected.to eq(confusion_matrix: [[0, 0], [0, 0]], accuracy: nil) }
        end

        context 'with example_optimal, optimal only' do
          let(:llm_feedbacks) { [double(example_optimal?: true, optimal?: true)] }

          it { is_expected.to eq(confusion_matrix: [[1, 0], [0, 0]], accuracy: 1) }
        end

        context 'with example_sub-optimal, optimal only' do
          let(:llm_feedbacks) { [double(example_optimal?: true, optimal?: false)] }

          it { is_expected.to eq(confusion_matrix: [[0, 1], [0, 0]], accuracy: 0) }
        end

        context 'with example_optimal, sub-optimal only' do
          let(:llm_feedbacks) { [double(example_optimal?: false, optimal?: true)] }

          it { is_expected.to eq(confusion_matrix: [[0, 0], [1, 0]], accuracy: 0) }
        end

        context 'with example_sub-optimal, sub-optimal only' do
          let(:llm_feedbacks) { [double(example_optimal?: false, optimal?: false)] }

          it { is_expected.to eq(confusion_matrix: [[0, 0], [0, 1]], accuracy: 1) }
        end

        context 'with mixed feedbacks' do
          let(:llm_feedbacks) do
            [
              double(example_optimal?: true, optimal?: true),
              double(example_optimal?: true, optimal?: false),
              double(example_optimal?: false, optimal?: true),
              double(example_optimal?: false, optimal?: false)
            ]
          end

          it { is_expected.to eq(confusion_matrix: [[1, 1], [1, 1]], accuracy: 0.5) }
        end
      end
    end
  end
end
