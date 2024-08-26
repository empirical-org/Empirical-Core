# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_trials
#
#  id                  :bigint           not null, primary key
#  evaluation_duration :float
#  number              :integer          not null
#  results             :jsonb
#  status              :string           default("pending"), not null
#  trial_duration      :float
#  trial_errors        :text             default([]), not null, is an Array
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  dataset_id          :integer          not null
#  llm_id              :integer          not null
#  llm_prompt_id       :integer          not null
#
require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe Trial, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should validate_presence_of(:status) }
        it { should validate_presence_of(:llm_id) }
        it { should validate_presence_of(:llm_prompt_id) }
        it { should validate_presence_of(:dataset_id) }

        it { should validate_inclusion_of(:status).in_array(described_class::STATUSES) }

        it { should have_readonly_attribute(:llm_id) }
        it { should have_readonly_attribute(:llm_prompt_id) }
        it { should have_readonly_attribute(:dataset_id) }

        it { should belong_to(:llm) }
        it { should belong_to(:llm_prompt) }
        it { should belong_to(:dataset) }

        it { have_many(:llm_examples) }
        it { have_many(:test_examples).through(:dataset) }

        describe 'callbacks' do
          describe 'before_create :set_trial_number' do
            let(:dataset) { create(:evidence_research_gen_ai_dataset) }

            let!(:trial1) { create(:evidence_research_gen_ai_trial, dataset:) }
            let!(:trial2) { create(:evidence_research_gen_ai_trial, dataset:) }

            it { expect(trial1.number).to eq(1) }
            it { expect(trial2.number).to eq(2) }

            it 'assigns the correct number to a new trial' do
              new_trial = create(:evidence_research_gen_ai_trial, dataset:)
              expect(new_trial.number).to eq(3)
            end

            it 'assigns the correct number to a new trial with a different dataset' do
              new_trial = create(:evidence_research_gen_ai_trial)
              expect(new_trial.number).to eq(1)
            end
          end
        end

        describe '#run' do
          subject { trial.run }

          let(:batch) { Sidekiq::Batch.new }
          let(:trial) { create(factory) }
          let(:dataset) { trial.dataset }
          let(:test_examples_count) { 3 }
          let!(:test_examples) { create_list(:evidence_research_gen_ai_test_example, test_examples_count, dataset:) }

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

          it 'updates status to running and sets trial_start_time' do
            expect(BuildLLMExampleWorker).to receive(:perform_async).exactly(test_examples_count).times
            subject
            expect(trial.status).to eq('running')
            expect(trial.trial_start_time).to be_present
          end

          it 'creates a Sidekiq batch and enqueues jobs' do
            expect(batch).to receive(:on).with(:complete, Trial, trial_id: trial.id)
            expect(BuildLLMExampleWorker).to receive(:perform_async).exactly(test_examples_count).times
            subject
          end

          it 'handles errors and updates status to failed' do
            allow(batch).to receive(:on).and_raise(StandardError.new('Test error'))
            subject
            expect(trial.status).to eq('failed')
            expect(trial.trial_errors).to include('Test error')
          end
        end
      end
    end
  end
end
