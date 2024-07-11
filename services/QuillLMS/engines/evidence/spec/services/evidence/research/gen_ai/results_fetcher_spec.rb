# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe ResultsFetcher, type: :service do
        subject { described_class.run(trial) }

        let(:trial) { create(:evidence_research_gen_ai_trial, results: '{}') }

        let(:test_example1) { create(:evidence_research_gen_ai_test_example) }
        let(:llm_example_identical) do
          create(
            :evidence_research_gen_ai_llm_example,
            :optimal,
            test_example: test_example1,
            llm_feedback: test_example1.staff_feedback
          )
        end

        let(:test_example2) { create(:evidence_research_gen_ai_test_example) }
        let(:llm_example_non_identical) do
          create(
            :evidence_research_gen_ai_llm_example,
            test_example: test_example2,
            llm_feedback: 'this is different feedback'
          )
        end

        before do
          stub_const('Evidence::Research::GenAI::ResultsFetcher::ENDPOINT', 'http://example.com/metrics')
          stub_request(:post, described_class::ENDPOINT).to_return(misc_metrics)
          allow(trial).to receive(:llm_examples).and_return(llm_examples)
        end

        context 'with g_eval ids' do
          let(:misc_metrics) { {} }
          let(:llm_examples) { [llm_example_identical, llm_example_non_identical] }

          before { trial.update!(results: { g_eval_ids: [1] }) }

          it 'runs GEvalRunner for each g_eval id' do
            expect(GEvalRunner).to receive(:run).twice
            subject
          end
        end
      end
    end
  end
end
