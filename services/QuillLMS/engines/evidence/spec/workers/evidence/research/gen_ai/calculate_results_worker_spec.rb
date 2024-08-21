# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe CalculateResultsWorker do
        subject { described_class.new.perform(trial.id) }

        let(:trial) { create(:evidence_research_gen_ai_trial) }

        before { stub_const('ENV', 'STOP_ALL_GEN_AI_TRIALS' => stop_all_gen_ai_trials) }

        context 'when STOP_ALL_GEN_AI_TRIALS is true' do
          let(:stop_all_gen_ai_trials) { 'true' }

          it 'does not process the trial' do
            expect(Trial).not_to receive(:find)
            subject
          end
        end

        context 'when STOP_ALL_GEN_AI_TRIALS is false' do
          let(:stop_all_gen_ai_trials) { 'false' }
          let(:fetched_results) { { key: 'value' } }

          before do
            allow(GEvalScoresFetcher).to receive(:run).with(trial)
            allow(Trial).to receive(:find).with(trial.id).and_return(trial)
          end

          it 'updates the confusion matrix' do
            expect(trial).to receive(:update_results!).with(confusion_matrix: [[0, 0], [0, 0]])
            expect(trial).to receive(:update!).with(evaluation_start_time: a_kind_of(ActiveSupport::TimeWithZone))
            subject
          end
        end
      end
    end
  end
end
