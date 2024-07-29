# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe ColoredContentsBuilder do
        subject { described_class.run(contents:) }

        let(:general_substitutions) { PromptTemplateVariable.general_substitutions }
        let(:activity_substitutions) { LLMPromptBuilder.activity_substitutions }
        let(:red) { described_class::ACTIVITY_COLOR }
        let(:blue) { described_class::GENERAL_COLOR }

        before { create_list(:evidence_research_gen_ai_prompt_template_variable, 2) }

        def color_span(color, text) = "<span style='color: #{color};'>#{text}</span>"

        context 'empty contents' do
          let(:contents) { '' }

          it { is_expected.to eq '' }
        end

        context 'contents contains no substitutions' do
          let(:contents) { 'No substitutions here.' }

          it { is_expected.to eq contents }
        end

        context 'contents contains activity substitutions' do
          let(:contents) { "Some text #{sub1} with #{sub2}." }
          let(:sub1) { activity_substitutions.first }
          let(:sub2) { activity_substitutions.second }

          it { is_expected.to eq "Some text #{color_span(red, sub1)} with #{color_span(red, sub2)}." }
        end

        context 'contents contains general substitutions' do
          let(:contents) { "Some text #{sub1} with #{sub2}." }
          let(:sub1) { general_substitutions.first }
          let(:sub2) { general_substitutions.second }

          it { is_expected.to eq "Some text #{color_span(blue, sub1)} with #{color_span(blue, sub2)}." }
        end

        context 'contents contains newlines' do
          let(:contents) { "#{sub1}\n#{sub2}" }
          let(:sub1) { activity_substitutions.first }
          let(:sub2) { general_substitutions.second }

          it { is_expected.to eq "#{color_span(red, sub1)}<br>#{color_span(blue, sub2)}" }
        end
      end
    end
  end
end
