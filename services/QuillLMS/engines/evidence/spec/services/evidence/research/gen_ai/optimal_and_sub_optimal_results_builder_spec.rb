# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe OptimalAndSubOptimalResultsBuilder, type: :service do
        subject { described_class.run(llm_feedbacks) }

        context 'when there are no llm feedbacks' do
          let(:llm_feedbacks) { [] }

          it { is_expected.to eq(confusion_matrix: [[0, 0], [0, 0]], accuracy: nil) }
        end

        context 'with quill_optimal, optimal only' do
          let(:llm_feedbacks) { [double(quill_optimal?: true, optimal?: true)] }

          it { is_expected.to eq(confusion_matrix: [[1, 0], [0, 0]], accuracy: 1) }
        end

        context 'with quill_sub-optimal, optimal only' do
          let(:llm_feedbacks) { [double(quill_optimal?: true, optimal?: false)] }

          it { is_expected.to eq(confusion_matrix: [[0, 1], [0, 0]], accuracy: 0) }
        end

        context 'with quill_optimal, sub-optimal only' do
          let(:llm_feedbacks) { [double(quill_optimal?: false, optimal?: true)] }

          it { is_expected.to eq(confusion_matrix: [[0, 0], [1, 0]], accuracy: 0) }
        end

        context 'with quill_sub-optimal, sub-optimal only' do
          let(:llm_feedbacks) { [double(quill_optimal?: false, optimal?: false)] }

          it { is_expected.to eq(confusion_matrix: [[0, 0], [0, 1]], accuracy: 1) }
        end

        context 'with mixed feedbacks' do
          let(:llm_feedbacks) do
            [
              double(quill_optimal?: true, optimal?: true),
              double(quill_optimal?: true, optimal?: false),
              double(quill_optimal?: false, optimal?: true),
              double(quill_optimal?: false, optimal?: false)
            ]
          end

          it { is_expected.to eq(confusion_matrix: [[1, 1], [1, 1]], accuracy: 0.5) }
        end
      end
    end
  end
end
