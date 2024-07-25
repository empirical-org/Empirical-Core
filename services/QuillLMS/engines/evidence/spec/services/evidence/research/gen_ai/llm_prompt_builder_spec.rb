# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe LLMPromptBuilder do
        subject { described_class.run(dataset_id:, guidelines:, llm_prompt_template_id:, prompt_examples:) }

        let(:contents) { 'This is contents' }
        let(:dataset) { create(:evidence_research_gen_ai_dataset) }
        let(:dataset_id) { dataset.id }
        let(:stem_vault) { dataset.stem_vault }
        let(:stem_vault_id) { stem_vault.id }
        let(:stem) { stem_vault.stem }
        let(:conjunction) { stem_vault.conjunction }
        let(:because_text) { stem_vault.because_text }
        let(:but_text) { stem_vault.but_text }
        let(:so_text) { stem_vault.so_text }
        let(:full_text) { stem_vault.full_text }
        let(:llm_prompt_template_id) { create(:evidence_research_gen_ai_llm_prompt_template, contents:).id }

        let(:optimal_guidelines) { create_list(:evidence_research_gen_ai_guideline, 3, :optimal, stem_vault:) }
        let(:suboptimal_guidelines) { create_list(:evidence_research_gen_ai_guideline, 3, :suboptimal, stem_vault:) }
        let(:guidelines) { Guideline.where(id: (optimal_guidelines.map(&:id) + suboptimal_guidelines.map(&:id))) }

        let(:optimal_examples) { create_list(:evidence_research_gen_ai_prompt_example, 3, :optimal, dataset:) }
        let(:suboptimal_examples) { create_list(:evidence_research_gen_ai_prompt_example, 3, :suboptimal, dataset:) }
        let(:prompt_examples) { PromptExample.where(id: (optimal_examples.map(&:id) + suboptimal_examples.map(&:id))) }

        def delimit(placeholder) = "#{described_class::DELIMITER}#{placeholder}#{described_class::DELIMITER}"

        context 'nil llm_prompt_template_id' do
          let(:llm_prompt_template_id) { nil }

          it { expect { subject.run }.to raise_error ActiveModel::ValidationError }
        end

        context 'nil dataset_id' do
          let(:dataset_id) { nil }

          it { expect { subject.run }.to raise_error ActiveModel::ValidationError }
        end

        context 'contents with no substitutions' do
          it { is_expected.to eq contents }
        end

        context 'contents with substitutions' do
          context 'stem' do
            let(:contents) { delimit('stem') }

            it { is_expected.to eq stem }
          end

          context 'conjunction' do
            let(:contents) { delimit('conjunction') }

            it { is_expected.to eq conjunction }
          end

          context 'because_text' do
            let(:contents) { delimit('because_text') }

            it { is_expected.to eq because_text }
          end

          context 'but_text' do
            let(:contents) { delimit('but_text') }

            it { is_expected.to eq but_text }
          end

          context 'so_text' do
            let(:contents)  { delimit('so_text') }

            it { is_expected.to eq so_text }
          end

          context 'full_text' do
            let(:contents) { delimit('full_text') }

            it { is_expected.to eq full_text }
          end

          context 'optimal_guidelines' do
            let(:contents) { delimit('optimal_guidelines') }

            it { is_expected.to eq optimal_guidelines.map(&:text).join("\n") }
          end

          context 'suboptimal_guidelines' do
            let(:contents) { delimit('suboptimal_guidelines') }

            it { is_expected.to eq suboptimal_guidelines.map(&:text).join("\n") }
          end

          context 'optimal_examples' do
            let(:contents) { delimit('optimal_examples') }

            it { is_expected.to eq optimal_examples.map(&:response_feedback_status).join("\n") }
          end

          context 'suboptimal_examples' do
            let(:contents) { delimit('suboptimal_examples') }

            it { is_expected.to eq suboptimal_examples.map(&:response_feedback_status).join("\n") }
          end

          context 'multiple substitutions' do
            let(:filler) { '...some filler here...' }
            let(:contents) { "#{delimit('stem')} #{filler} #{delimit('conjunction')}" }

            it { is_expected.to eq "#{stem} #{filler} #{conjunction}" }
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
