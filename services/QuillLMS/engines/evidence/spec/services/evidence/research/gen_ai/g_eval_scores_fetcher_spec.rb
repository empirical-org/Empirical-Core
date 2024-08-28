# frozen_string_literal: true

require 'rails_helper'
require 'sidekiq-pro'

module Evidence
  module Research
    module GenAI
      RSpec.describe GEvalScoresFetcher do
        subject { described_class.run(trial) }

        let(:trial) { create(:evidence_research_gen_ai_trial) }

        let!(:llm_examples) { create_list(:evidence_research_gen_ai_llm_example, 3, trial:) }
        let(:llm_example_ids) { llm_examples.pluck(:id) }

        let(:g_evals) { create_list(:evidence_research_gen_ai_g_eval, 2) }
        let(:g_eval_ids) { g_evals.pluck(:id) }

        let(:completion_callback_class) { GEvalScoresFetcherCallback }
        let(:sidekiq_batch) { instance_double('Sidekiq::Batch') }
        let(:worker) { RunGEvalWorker }

        before do
          allow(trial).to receive(:g_eval_ids).and_return(g_eval_ids)
          allow(::Sidekiq::Batch).to receive(:new).and_return(sidekiq_batch)
          allow(sidekiq_batch).to receive(:on)
          allow(sidekiq_batch).to receive(:jobs).and_yield
        end

        describe '#run' do
          it 'creates a new Sidekiq::Batch' do
            expect(::Sidekiq::Batch).to receive(:new)
            subject
          end

          it 'sets up the completion callback' do
            expect(sidekiq_batch).to receive(:on).with(
              :complete,
              completion_callback_class,
              trial_id: trial.id,
              llm_example_ids:
            )
            subject
          end

          it 'enqueues jobs for each combination of g_eval_id and llm_example_id' do
            g_eval_ids.each do |g_eval_id|
              llm_example_ids.each do |llm_example_id|
                expect(worker).to receive(:perform_async).with(trial.id, g_eval_id, llm_example_id)
              end
            end

            subject
          end
        end
      end
    end
  end
end
