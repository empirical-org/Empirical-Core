# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe BuildLLMExampleWorker, type: :worker do
        subject { described_class.new.perform(trial.id, test_example.id) }

        let(:dataset) { create(:evidence_research_gen_ai_dataset, :generative) }
        let(:trial) { create(:evidence_research_gen_ai_trial, dataset:) }
        let(:llm) { trial.llm }
        let(:test_example) { create(:evidence_research_gen_ai_test_example, dataset: trial.dataset) }
        let(:raw_text) { '{"optimal":false,"feedback":"Clear your response and try again."}' }
        let(:llm_feedback) { 'Clear your response and try again.' }
        let(:llm_assigned_status) { false }

        before do
          trial.update!(results: {})
          allow(Trial).to receive(:find).with(trial.id).and_return(trial)
          allow(trial).to receive(:llm).and_return(llm)
          allow(llm).to receive(:completion).and_return(raw_text)
          allow(LLMFeedbackResolver).to receive(:run).with(raw_text:).and_return(llm_feedback)
          allow(LLMAssignedStatusResolver).to receive(:run).with(raw_text:).and_return(llm_assigned_status)
        end

        it { expect { subject }.to change(LLMExample, :count).by(1) }

        it 'updates trial results with api_call_time' do
          expect(trial).to receive(:update_results!)
          subject
        end

        context 'when an error occurs' do
          before { allow(LLMExample).to receive(:create!).and_raise(StandardError.new('Test error')) }

          it { expect { subject }.to change { trial.trial_errors.count }.by(1) }

          it 'saves the trial' do
            expect(trial).to receive(:save!)
            subject
          end
        end
      end
    end
  end
end
