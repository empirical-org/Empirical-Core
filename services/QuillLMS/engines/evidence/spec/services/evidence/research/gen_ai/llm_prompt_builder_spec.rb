# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe LLMPromptBuilder do
        subject { described_class.run(llm_prompt_template_id:, stem_vault_id:) }

        let(:contents) { 'This is contents' }
        let(:llm_prompt_template_id) { create(:evidence_research_gen_ai_llm_prompt_template, contents:).id }
        let(:stem_vault) { create(:evidence_research_gen_ai_stem_vault) }
        let(:stem) { stem_vault.stem }
        let(:stem_vault_id) { stem_vault.id }
        let(:conjunction) { stem_vault.conjunction }
        let(:because_text) { stem_vault.because_text }
        let(:but_text) { stem_vault.but_text }
        let(:so_text) { stem_vault.so_text }
        let(:full_text) { stem_vault.full_text }
        let(:examples_substitution) { described_class::EXAMPLES_SUBSTITUTION }

        def delimit(placeholder) = "#{described_class::DELIMITER}#{placeholder}#{described_class::DELIMITER}"

        context 'nil llm_prompt_template_id' do
          let(:llm_prompt_template_id) { nil }

          it { expect { subject.run }.to raise_error ActiveModel::ValidationError }
        end

        context 'nil stem_vault_id' do
          let(:stem_vault_id) { nil }

          it { expect { subject.run }.to raise_error ActiveModel::ValidationError }
        end

        context 'contents with no substitutions' do
          it { is_expected.to eq contents }
        end

        context 'contents with substitutions' do
          context 'stem' do
            let(:contents)  { delimit('stem') }

            it { is_expected.to eq stem }
          end

          context 'conjunction' do
            let(:contents)  { delimit('conjunction') }

            it { is_expected.to eq conjunction }
          end

          context 'because_text' do
            let(:contents)  { delimit('because_text') }

            it { is_expected.to eq because_text }
          end

          context 'but_text' do
            let(:contents)  { delimit('but_text') }

            it { is_expected.to eq but_text }
          end

          context 'so_text' do
            let(:contents)  { delimit('so_text') }

            it { is_expected.to eq so_text }
          end

          context 'full_text' do
            let(:contents)  { delimit('full_text') }

            it { is_expected.to eq full_text }
          end

          context 'examples_substitution' do
            let(:num_of_examples) { 5 }

            let!(:quill_feedbacks) do
              create_list(
                :evidence_research_gen_ai_quill_feedback,
                num_of_examples,
                :prompt_engineering,
                student_response: create(:evidence_research_gen_ai_student_response, stem_vault:)
              )
            end

            let(:limit) { 3 }

            let(:contents) { delimit("#{examples_substitution},#{limit}") }

            it { is_expected.to eq quill_feedbacks.first(limit).map(&:response_and_feedback).join("\n") }
          end

          context 'multiple substitutions' do
            let(:filler) { '...some filler here...'}
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
