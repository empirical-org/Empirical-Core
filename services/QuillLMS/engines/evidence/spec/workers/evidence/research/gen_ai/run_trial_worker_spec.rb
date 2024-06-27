# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe Evidence::Research::GenAI::RunTrialWorker do
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

          before { allow(Trial).to receive(:find).with(trial.id).and_return(trial) }

          it 'finds and runs the trial' do
            expect(trial).to receive(:run)
            subject
          end
        end
      end
    end
  end
end
