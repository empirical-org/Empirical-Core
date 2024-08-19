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

          let(:trial) { create(factory) }
          let(:dataset) { trial.dataset }
          let(:llm) { trial.llm }
          let(:llm_prompt) { trial.llm_prompt }
          let(:raw_text) { { 'feedback' => 'This is feedback', 'optimal' => true }.to_json }
          let(:test_examples_count) { 3 }

          let!(:test_examples) { create_list(:evidence_research_gen_ai_test_example, test_examples_count, dataset:) }

          before do
            allow(trial).to receive(:llm).and_return(llm)

            allow(llm)
              .to receive(:completion)
              .with(instance_of(String))
              .and_return(raw_text)

            allow(CalculateResultsWorker).to receive(:perform_async).with(trial.id)
          end

          it { expect { subject }.to change { trial.reload.status }.to(described_class::COMPLETED) }
          it { expect { subject }.to change(LLMExample, :count).by(test_examples_count) }

          context 'when querying LLM' do
            it 'only processes testing example student responses' do
              expect(llm).to receive(:completion).exactly(test_examples_count).times

              subject
            end

            it 'measures and records API call times' do
              # 2 calls for each example: one for the API call and one for the trial_duration
              expect(Time.zone).to receive(:now).exactly((test_examples_count * 2) + 2).times.and_call_original

              subject

              expect(trial.reload.api_call_times.size).to eq(test_examples_count)
            end
          end

          context 'when an error occurs during execution' do
            let(:error_message) { 'Test error' }

            before { allow(trial).to receive(:query_llm).and_raise(StandardError, error_message) }

            it { expect { subject }.to change { trial.reload.status }.to(described_class::FAILED) }
            it { expect { subject }.not_to change(LLMExample, :count) }
            it { expect { subject }.to change { trial.reload.trial_errors }.from([]).to([error_message]) }
          end

          context 'when the trial is not pending' do
            before { trial.update!(status: described_class::FAILED) }

            it { expect { subject }.not_to change { trial.reload.status } }
            it { expect { subject }.not_to change(LLMExample, :count) }
          end
        end
      end
    end
  end
end
