# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe ResultsFetcher, type: :service do
        subject { described_class.run(llm_feedbacks) }

        before do
          stub_const("Evidence::Research::GenAI::ResultsFetcher::ENDPOINT", 'http://example.com/metrics')
          stub_request(:post, described_class::ENDPOINT).to_return(misc_metrics)
        end

        context 'accuracy_identical results' do
          let(:result) { subject[:accuracy_identical] }

          let(:example_feedback1) { create(:evidence_research_gen_ai_example_feedback) }

          let(:llm_feedback_identical) do
            create(
             :evidence_research_gen_ai_llm_feedback,
             passage_prompt_response: example_feedback1.passage_prompt_response,
             text: example_feedback1.text
            )
          end

          let(:example_feedback2) { create(:evidence_research_gen_ai_example_feedback) }

          let(:llm_feedback_non_identical) do
            create(
              :evidence_research_gen_ai_llm_feedback,
              passage_prompt_response: example_feedback2.passage_prompt_response,
              text: 'this is different feedback'
            )
          end

          let(:misc_metrics) { {} }

          context 'when there are no llm feedbacks' do
            let(:llm_feedbacks) { [] }

            it { expect(result).to eq nil }
          end

          context 'with identical feedback' do
            let(:llm_feedbacks) { [llm_feedback_identical] }

            it { expect(result).to eq 1.0 }
          end

          context 'with non-identical feedback' do
            let(:llm_feedbacks) { [llm_feedback_non_identical] }

            it { expect(result).to eq 0 }
          end

          context 'with mixed feedbacks' do
            let(:llm_feedbacks) { [llm_feedback_identical, llm_feedback_non_identical] }

            it { expect(result).to eq 0.5 }
          end
        end
      end
    end
  end
end
