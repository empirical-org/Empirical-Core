# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe LLMPromptBuilder do
        subject { described_class.run(llm_prompt_template_id:, activity_prompt_config_id:) }

        let(:contents) { 'This is contents' }
        let(:llm_prompt_template_id) { create(:evidence_research_gen_ai_llm_prompt_template, contents:).id }
        let(:activity_prompt_config) { create(:evidence_research_gen_ai_activity_prompt_config) }
        let(:stem_and_conjunction) { activity_prompt_config.stem_and_conjunction }
        let(:optimal_rules) { activity_prompt_config.optimal_rules }
        let(:sub_optimal_rules) { activity_prompt_config.sub_optimal_rules}
        let(:activity_prompt_config_id) { activity_prompt_config.id }

        def delimit(placeholder) = "#{described_class::DELIMITER}#{placeholder}#{described_class::DELIMITER}"

        context 'nil llm_prompt_template_id' do
          let(:llm_prompt_template_id) { nil }

          it { expect { subject.run }.to raise_error ActiveModel::ValidationError }
        end

        context 'nil activity_prompt_config_id' do
          let(:activity_prompt_config_id) { nil }

          it { expect { subject.run }.to raise_error ActiveModel::ValidationError }
        end

        context 'contents with no substitutions' do
          it { is_expected.to eq contents }
        end

        context 'contents with substitutions' do
          context 'stem_and_conjunction' do
            let(:contents)  { delimit('stem_and_conjunction') }

            it { is_expected.to eq stem_and_conjunction }
          end

          context 'sub_optimal_rules' do
            let(:contents)  { delimit('sub_optimal_rules') }

            it { is_expected.to eq sub_optimal_rules }
          end

          context 'optimal_rules' do
            let(:contents)  { delimit('optimal_rules') }

            it { is_expected.to eq optimal_rules }
          end

          context 'examples' do
            let(:num_of_examples) { 5 }

            let!(:quill_feedbacks) do
              create_list(
                :evidence_research_gen_ai_quill_feedback,
                num_of_examples,
                :prompt_engineering,
                student_response: create(:evidence_research_gen_ai_student_response, activity_prompt_config:)
              )
            end

            let(:limit) { 3 }

            let(:contents) { delimit("prompt_engineering_response_feedback_pairs,#{limit}") }

            it { is_expected.to eq quill_feedbacks.first(limit).map(&:response_and_feedback).join("\n") }
          end

          context 'multiple substitutions' do
            let(:filler) { '...some filler here...'}
            let(:contents) { "#{delimit('stem_and_conjunction')} #{filler} #{delimit('optimal_rules')}" }

            it { is_expected.to eq "#{stem_and_conjunction} #{filler} #{optimal_rules}" }
          end
        end

        context 'contents with PromptTemplateVariable' do
          let(:prompt_template_variable) { create(:evidence_research_gen_ai_prompt_template_variable) }
          let(:contents) { prompt_template_variable.substitution }

          it { is_expected.to eq prompt_template_variable.value }
        end
      end
    end
  end
end
