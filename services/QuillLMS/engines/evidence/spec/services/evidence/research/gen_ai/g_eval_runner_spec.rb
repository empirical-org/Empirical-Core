# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe GEvalRunner do
        subject { described_class.run(g_eval_id:, llm_feedback:) }

        let(:g_eval) { create(:evidence_research_gen_ai_g_eval) }
        let(:g_eval_id) { g_eval.id }
        let(:metric) { g_eval.metric }

        let(:example_feedback) { create(:evidence_research_gen_ai_example_feedback) }

        let(:llm_feedback) do
          create(
           :evidence_research_gen_ai_llm_feedback,
           passage_prompt_response: example_feedback.passage_prompt_response,
           text: example_feedback.text
          )
        end

        let(:llm) { instance_double('LLM', completion: llm_response) }
        let(:llm_response) { { metric => score }.to_json }
        let(:score) { rand(1..g_eval.max_score) }

        before { allow(LLM).to receive(:g_eval).and_return(llm) }

        it { is_expected.to eq score }
      end
    end
  end
end
