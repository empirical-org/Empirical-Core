# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe GEvalScoresFetcherCallback do
        subject { described_class.new }

        let(:trial) { create(:evidence_research_gen_ai_trial) }
        let(:llm_example_ids) { [1, 2, 3] }
        let(:g_eval_ids) { [101, 102] }
        let(:options) { { 'trial_id' => trial.id, 'llm_example_ids' => llm_example_ids } }
        let(:status) { double('Status') }

        before do
          allow(Trial).to receive(:find).with(trial.id).and_return(trial)
          allow(trial).to receive(:g_eval_ids).and_return(g_eval_ids)
          allow(trial).to receive(:update_results!)
          allow(trial).to receive(:update!)
        end

        describe '#on_complete' do
          let(:evaluation_start_time) { '2023-06-01 10:00:00' }
          let(:current_time) { Time.zone.parse('2023-06-01 10:30:00') }

          before do
            allow(Time.zone).to receive(:now).and_return(current_time)
            allow(Time.zone).to receive(:parse).with(trial.evaluation_start_time).and_return(Time.zone.parse(evaluation_start_time))
            allow(callback).to receive(:g_evals).and_return({ 101 => [1, 2, 3], 102 => [4, 5, 6] })
          end

          it 'finds the trial' do
            expect(Trial).to receive(:find).with(trial.id)
            callback.on_complete(status, options)
          end

          it 'updates the trial results' do
            expect(trial).to receive(:update_results!).with(g_evals: { 101 => [1, 2, 3], 102 => [4, 5, 6] })
            callback.on_complete(status, options)
          end

          it 'updates the evaluation duration' do
            expect(trial).to receive(:update!).with(evaluation_duration: 30.minutes)
            callback.on_complete(status, options)
          end
        end

        describe '#g_evals' do
          let(:g_eval_score1) { create(:g_eval_score, trial: trial, g_eval_id: 101, llm_example_id: 1, score: 0.8) }
          let(:g_eval_score2) { create(:g_eval_score, trial: trial, g_eval_id: 101, llm_example_id: 2, score: 0.9) }
          let(:g_eval_score3) { create(:g_eval_score, trial: trial, g_eval_id: 102, llm_example_id: 1, score: 0.7) }

          before do
            g_eval_score1
            g_eval_score2
            g_eval_score3
          end

          it 'returns a hash of g_eval_ids with arrays of scores' do
            result = callback.send(:g_evals, trial, llm_example_ids)
            expect(result).to eq({
              101 => [0.8, 0.9, nil],
              102 => [0.7, nil, nil]
            })
          end

          it 'handles missing scores' do
            result = callback.send(:g_evals, trial, [1, 2, 3, 4])
            expect(result).to eq({
              101 => [0.8, 0.9, nil, nil],
              102 => [0.7, nil, nil, nil]
            })
          end

          it 'returns an empty hash if trial has no g_eval_ids' do
            allow(trial).to receive(:g_eval_ids).and_return(nil)
            result = callback.send(:g_evals, trial, llm_example_ids)
            expect(result).to eq({})
          end
        end
      end
    end
  end
end
