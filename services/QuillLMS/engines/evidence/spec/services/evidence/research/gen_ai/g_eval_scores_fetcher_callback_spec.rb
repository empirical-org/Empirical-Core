# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe GEvalScoresFetcherCallback do
        subject { described_class.new }

        let(:trial) { create(:evidence_research_gen_ai_trial) }
        let(:llm_examples) { create_list(:evidence_research_gen_ai_llm_example, 2) }
        let(:g_evals) { create_list(:evidence_research_gen_ai_g_eval, 2) }
        let(:g_eval_ids) { g_evals.pluck(:id) }
        let(:options) { { 'trial_id' => trial.id, 'llm_example_ids' => llm_examples.pluck(:id) } }

        before do
          trial.update!(g_eval_ids:)
          trial.update!(evaluation_start_time: Time.zone.now)
          allow(Trial).to receive(:find).with(options['trial_id']).and_return(trial)
        end

        describe '#on_complete' do
          context 'when all GEvalScores are present' do
            before do
              g_evals.each do |g_eval|
                llm_examples.each do |llm_example|
                  create(:evidence_research_gen_ai_g_eval_score, trial:, g_eval:, llm_example:)
                end
              end
            end

            it 'updates the trial results and evaluation duration' do
              expect(trial).to receive(:update_results!).with(g_evals: kind_of(Hash))
              expect(trial).to receive(:update!).with(evaluation_duration: kind_of(Float))

              subject.on_complete(nil, options)
            end

            it 'calculates the correct g_evals hash' do
              allow(trial).to receive(:update_results!) do |args|
                expect(args[:g_evals].keys).to match_array(g_evals.pluck(:id))
                expect(args[:g_evals].values).to all(be_an(Array))
                expect(args[:g_evals].values.flatten).to all(be_a(Integer))
              end

              subject.on_complete(nil, options)
            end
          end

          context 'when some GEvalScores are missing' do
            before do
              create(
                :evidence_research_gen_ai_g_eval_score,
                trial:,
                g_eval: g_evals.first,
                llm_example: llm_examples.first
              )
            end

            it 'includes nil for missing scores' do
              allow(trial).to receive(:update_results!) do |args|
                expect(args[:g_evals].values.flatten).to include(nil)
              end

              subject.on_complete(nil, options)
            end
          end

          it 'calculates the evaluation duration correctly' do
            start_time = 1.hour.ago
            allow(trial).to receive(:evaluation_start_time).and_return(start_time.to_s)
            allow(Time.zone).to receive(:now).and_return(Time.zone.now)

            expect(trial).to receive(:update!).with(evaluation_duration: be_within(1).of(3600))

            subject.on_complete(nil, options)
          end
        end
      end
    end
  end
end
