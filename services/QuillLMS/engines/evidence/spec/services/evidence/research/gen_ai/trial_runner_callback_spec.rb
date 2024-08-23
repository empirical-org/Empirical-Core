# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe TrialRunnerCallback do
        describe '#on_complete' do
          subject { described_class.new.on_complete(nil, options) }

          let(:trial) { create(:evidence_research_gen_ai_trial) }
          let(:options) { { 'trial_id' => trial.id } }

          before do
            trial.set_trial_start_time
            allow(Trial).to receive(:find).with(trial.id).and_return(trial)
            allow(CalculateResultsWorker).to receive(:perform_async)
          end

          it 'sets the trial duration' do
            expect(trial).to receive(:set_trial_duration)
            subject
          end

          it 'enqueues the CalculateResultsWorker' do
            expect(CalculateResultsWorker).to receive(:perform_async).with(trial.id)
            subject
          end

          it 'sets the trial status' do
            expect(trial).to receive(:set_status)
            subject
          end
        end
      end
    end
  end
end
