# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe Evidence::Research::GenAI::RunTrialWorker do
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
