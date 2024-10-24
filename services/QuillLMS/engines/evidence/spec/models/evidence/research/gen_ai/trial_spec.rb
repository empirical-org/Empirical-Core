# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_trials
#
#  id                  :bigint           not null, primary key
#  evaluation_duration :float
#  notes               :text
#  number              :integer          not null
#  results             :jsonb
#  status              :string           default("pending"), not null
#  temperature         :float            not null
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
        let(:trial) { create(factory) }

        it { expect(build(factory)).to be_valid }

        it { should validate_presence_of(:status) }
        it { should validate_presence_of(:llm_id) }
        it { should validate_presence_of(:llm_prompt_id) }
        it { should validate_presence_of(:dataset_id) }
        it { should validate_presence_of(:temperature) }

        it { should validate_inclusion_of(:status).in_array(described_class::STATUSES) }

        it { should have_readonly_attribute(:llm_id) }
        it { should have_readonly_attribute(:llm_prompt_id) }
        it { should have_readonly_attribute(:dataset_id) }
        it { should have_readonly_attribute(:temperature) }

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

          before { allow(TrialRunner).to receive(:run) }

          it 'calls TrialRunner.run' do
            expect(TrialRunner).to receive(:run).with(trial)
            subject
          end
        end

        describe '#set_confusion_matrix' do
          subject { trial.set_confusion_matrix }

          let(:llm_examples) { create_list(:evidence_research_gen_ai_llm_example, 3, trial:) }
          let(:confusion_matrix) { [[2, 1], [0, 3]] }

          before do
            allow(trial).to receive(:generative?).and_return(true)
            allow(trial).to receive(:llm_examples).and_return(llm_examples)
            allow(GenerativeConfusionMatrixBuilder).to receive(:run).with(llm_examples:).and_return(confusion_matrix)
          end

          it 'calls ConfusionMatrixBuilder.run with llm_examples' do
            expect(GenerativeConfusionMatrixBuilder).to receive(:run).with(llm_examples:)
            subject
          end

          it 'updates the results with the confusion matrix' do
            expect(trial).to receive(:update_results!).with(confusion_matrix:)
            subject
          end
        end

        describe '#set_evaluation_start_time' do
          subject { trial.set_evaluation_start_time }

          it { expect { subject }.to change { trial.reload.evaluation_start_time } }
        end

        describe '#set_trial_start_time' do
          subject { trial.set_trial_start_time }

          it { expect { subject }.to change { trial.reload.trial_start_time } }
        end

        describe '#set_trial_duration' do
          subject { trial.set_trial_duration }

          let(:trial) { create(factory, trial_start_time: 1.hour.ago) }

          it { expect { subject }.to change { trial.reload.trial_duration }.to be_within(2.seconds).of(1.hour) }
        end

        describe '#set_status' do
          subject { trial.set_status }

          context 'when there are no errors' do
            it { expect { subject }.to change { trial.reload.status }.to(described_class::COMPLETED) }
          end

          context 'when there are errors' do
            before { allow(trial).to receive(:trial_errors).and_return(['error']) }

            it { expect { subject }.to change { trial.reload.status }.to(described_class::FAILED) }
          end
        end

        describe '#update_results!' do
          subject { trial.update_results!(new_data) }

          let(:new_data) { { 'key' => 'value' } }

          it { expect { subject }.to change { trial.reload.results }.to(new_data) }
        end
      end
    end
  end
end
