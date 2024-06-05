# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe LLMPromptBuilder do
        subject { described_class.run(llm_prompt_template_id:, passage_prompt_id:) }

        let(:contents) { 'This is contents' }
        let(:llm_prompt_template_id) { create(:evidence_research_gen_ai_llm_prompt_template, contents:).id }
        let(:instructions) { 'These are the instructions' }
        let(:prompt) { 'this is a prompt because' }
        let(:relevant_passage) { 'this is a relevant passage' }
        let(:passage_prompt) { create(:evidence_research_gen_ai_passage_prompt, prompt:, instructions:, relevant_passage:) }
        let(:passage_prompt_id) { passage_prompt.id }

        def delimit(placeholder) = "#{described_class::DELIMITER}#{placeholder}#{described_class::DELIMITER}"

        context 'nil llm_prompt_template_id' do
          let(:llm_prompt_template_id) { nil }

          it { expect { subject.run }.to raise_error ActiveModel::ValidationError }
        end

        context 'nil passage_prompt_id' do
          let(:passage_prompt_id) { nil }

          it { expect { subject.run }.to raise_error ActiveModel::ValidationError }
        end

        context 'contents with no substitutions' do
          it { is_expected.to eq contents }
        end

        context 'contents with substitutions' do
          context 'prompt' do
            let(:contents)  { delimit('prompt') }

            it { is_expected.to eq prompt }
          end

          context 'instructions' do
            let(:contents)  { delimit('instructions') }
            let(:instructions) { 'these are the instructions' }

            it { is_expected.to eq instructions }
          end

          context 'relevant_passage' do
            let(:contents)  { delimit('relevant_passage') }
            let(:relevant_passage) { 'this is a relevant passage' }

            it { is_expected.to eq relevant_passage }
          end

          context 'examples' do
            let(:num_of_examples) { 5 }

            let!(:quill_feedbacks) do
              create_list(
                :evidence_research_gen_ai_quill_feedback,
                num_of_examples,
                :prompt_engineering,
                passage_prompt_response: create(:evidence_research_gen_ai_passage_prompt_response, passage_prompt:)
              )
            end

            let(:limit) { 3 }
            let(:contents) { delimit("examples,#{limit}") }

            it { is_expected.to eq quill_feedbacks.first(limit).map(&:response_and_feedback).join("\n") }
          end

          context 'multiple substitutions' do
            let(:filler) { '...some filler here...'}
            let(:contents) { "#{delimit('prompt')} #{filler} #{delimit('instructions')}" }

            it { is_expected.to eq "#{prompt} #{filler} #{instructions}" }
          end
        end
      end
    end
  end
end
