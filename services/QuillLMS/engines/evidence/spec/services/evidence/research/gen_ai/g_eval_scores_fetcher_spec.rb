# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe GEvalScoresFetcher, type: :service do
        subject { described_class.run(trial) }

        let(:trial) { create(:evidence_research_gen_ai_trial) }
        let(:trial_id) { trial.id }
        let!(:llm_examples) { create_list(:evidence_research_gen_ai_llm_example, 3, trial:) }
        let(:llm_example_ids) { llm_examples.pluck(:id) }
        let(:g_eval_ids) { [101, 102] }
        let(:completion_callback_class) { GEvalScoresFetcherCallback }

        before { allow(trial).to receive(:g_eval_ids).and_return(g_eval_ids) }

        describe '#run' do
          let(:batch) { Sidekiq::Batch.new }

          before do
            stub_const(
              'Sidekiq::Batch',
              Class.new do
                attr_reader :callback, :callback_args, :event

                def initialize
                  @jobs = []
                end

                def on(event, klass, **args)
                  @event = event
                  @callback = klass
                  @callback_args = args
                end

                def jobs
                  yield @jobs if block_given?
                end
              end
            )
            allow(Sidekiq::Batch).to receive(:new).and_return(batch)
          end

          it 'creates a new Sidekiq::Batch' do
            expect(Sidekiq::Batch).to receive(:new).and_call_original
            subject
          end

          it 'sets up the completion callback' do
            subject
            expect(batch.event).to eq(:complete)
            expect(batch.callback).to eq(completion_callback_class)
            expect(batch.callback_args).to eq(trial_id:, llm_example_ids:)
          end

          it 'enqueues RunGEvalWorker jobs for each combination of g_eval_id and llm_example_id' do
            g_eval_ids.each do |g_eval_id|
              llm_example_ids.each do |llm_example_id|
                expect(RunGEvalWorker).to receive(:perform_async).with(trial.id, g_eval_id, llm_example_id)
              end
            end
            subject
          end
        end
      end
    end
  end
end
