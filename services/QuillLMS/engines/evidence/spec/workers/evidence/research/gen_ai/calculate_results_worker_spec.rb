# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe CalculateResultsWorker do
        subject { described_class.new.perform(experiment.id) }

        let(:experiment) { create(:evidence_research_gen_ai_experiment) }

        before { stub_const('ENV', 'STOP_ALL_GEN_AI_EXPERIMENTS' => stop_all_gen_ai_experiment) }

        context 'when STOP_ALL_GEN_AI_EXPERIMENTS is true' do
          let(:stop_all_gen_ai_experiment) { 'true' }

          it 'does not process the experiment' do
            expect(Experiment).not_to receive(:find)
            subject
          end
        end

        context 'when STOP_ALL_GEN_AI_EXPERIMENTS is false' do
          let(:stop_all_gen_ai_experiment) { 'false' }
          let(:fetched_results) { { key: 'value' } }

          before do
            allow(ResultsFetcher)
              .to receive(:run)
              .with(experiment.llm_feedbacks)
              .and_return(fetched_results)

            allow(Experiment)
              .to receive(:find)
              .with(experiment.id)
              .and_return(experiment)
          end

          it 'merges and updates the experiment results' do
            expect(experiment).to receive(:update!).with(results: fetched_results)
            subject
          end
        end
      end
    end
  end
end
