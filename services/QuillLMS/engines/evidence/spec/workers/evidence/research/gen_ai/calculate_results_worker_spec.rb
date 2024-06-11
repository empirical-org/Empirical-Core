# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe CalculateResultsWorker do
        subject { described_class.new.perform(trial.id) }

        let(:trial) { create(:evidence_research_gen_ai_trial) }

        before { stub_const('ENV', 'STOP_ALL_GEN_AI_EXPERIMENTS' => stop_all_gen_ai_experiments) }

        context 'when STOP_ALL_GEN_AI_EXPERIMENTS is true' do
          let(:stop_all_gen_ai_experiments) { 'true' }

          it 'does not process the trial' do
            expect(Trial).not_to receive(:find)
            subject
          end
        end

        context 'when STOP_ALL_GEN_AI_EXPERIMENTS is false' do
          let(:stop_all_gen_ai_experiments) { 'false' }
          let(:fetched_results) { { key: 'value' } }

          before do
            allow(ResultsFetcher)
              .to receive(:run)
              .with(trial)
              .and_return(fetched_results)

            allow(Trial)
              .to receive(:find)
              .with(trial.id)
              .and_return(trial)
          end

          it 'merges and updates the trial results' do
            expect(trial).to receive(:update_results).with(fetched_results)
            expect(trial).to receive(:update!).with(evaluation_duration: an_instance_of(Float))
            subject
          end
        end
      end
    end
  end
end
