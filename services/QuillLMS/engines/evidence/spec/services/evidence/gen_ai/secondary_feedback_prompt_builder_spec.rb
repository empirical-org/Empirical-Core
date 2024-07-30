# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Evidence::GenAI::SecondaryFeedbackPromptBuilder do
  let(:prompt) { create(:evidence_prompt) }
  let(:history) { [] }
  let(:template_file) { nil }
  let(:builder) { described_class.new(prompt: prompt, history: history, template_file: template_file) }

  describe '#initialize' do
    it 'sets the prompt, history, and template_file' do
      expect(builder.prompt).to eq(prompt)
      expect(builder.history).to eq(history)
      expect(builder.template_file).to eq(described_class::DEFAULT_TEMPLATE)
    end

    context 'when template_file is provided' do
      let(:template_file) { 'custom_template.md' }

      it 'sets the template_file to the provided value' do
        expect(builder.template_file).to eq('custom_template.md')
      end
    end
  end

  describe '#run' do
    before do
      allow(builder).to receive(:template).and_return('Template content with %{highlight_texts}, %{primary_secondary_examples}, %{plagiarism_text}')
      allow(builder).to receive(:template_variables).and_return(
        highlight_texts: 'Highlight texts',
        primary_secondary_examples: 'Primary and secondary examples',
        plagiarism_text: 'Plagiarism text'
      )
    end

    it 'returns the rendered template content' do
      result = builder.run
      expect(result).to include('Highlight texts')
      expect(result).to include('Primary and secondary examples')
      expect(result).to include('Plagiarism text')
    end
  end

  describe '#template_variables' do
    before do
      allow(builder).to receive(:highlight_texts).and_return('Highlight texts')
      allow(builder).to receive(:primary_secondary_examples).and_return('Primary and secondary examples')
      allow(builder).to receive(:plagiarism_text).and_return('Plagiarism text')
    end

    it 'returns a hash with the correct keys and values' do
      result = builder.send(:template_variables)
      expect(result).to eq({
        highlight_texts: 'Highlight texts',
        primary_secondary_examples: 'Primary and secondary examples',
        plagiarism_text: 'Plagiarism text'
      })
    end
  end

  describe '#default_template' do
    it 'returns the default template file name' do
      expect(builder.send(:default_template)).to eq(described_class::DEFAULT_TEMPLATE)
    end
  end

  describe '#template_folder' do
    it 'returns the template folder path' do
      expect(builder.send(:template_folder)).to eq(described_class::TEMPLATE_FOLDER)
    end
  end

  describe '#primary_secondary_examples' do
    let(:feedback_data_tuples) { [['Primary feedback 1', 'Secondary feedback 1'], ['Primary feedback 2', 'Secondary feedback 2']] }

    before do
      allow(builder).to receive(:feedback_data_tuples).and_return(feedback_data_tuples)
    end

    it 'returns markdown table rows of primary and secondary feedback examples' do
      result = builder.send(:primary_secondary_examples)
      expect(result).to eq("|Primary feedback 1|Secondary feedback 1|\n|Primary feedback 2|Secondary feedback 2|")
    end
  end

  describe '#feedback_data_tuples' do
    let(:feedback_data) do
      [
        OpenStruct.new(conjunction: 'because', primary: 'Primary feedback 1', secondary: 'Secondary feedback 1'),
        OpenStruct.new(conjunction: 'but', primary: 'Primary feedback 2', secondary: 'Secondary feedback 2')
      ]
    end

    before do
      allow(builder).to receive(:feedback_data).and_return(feedback_data)
    end

    it 'returns tuples of primary and secondary feedback examples filtered by conjunction and limited by EXAMPLE_LIMIT' do
      result = builder.send(:feedback_data_tuples)
      expect(result).to eq([['Primary feedback 1', 'Secondary feedback 1']])
    end
  end

  describe '#feedback_data' do
    let(:feedback_data) { [OpenStruct.new(conjunction: 'because')] }

    before do
      allow(Evidence::GenAI::SecondaryFeedbackDataFetcher).to receive(:run).and_return(feedback_data)
    end

    it 'fetches feedback data from SecondaryFeedbackDataFetcher' do
      result = builder.send(:feedback_data)
      expect(result).to eq(feedback_data)
    end
  end
end
