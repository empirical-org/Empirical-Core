# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Evidence::GenAI::SystemPromptBuilder, type: :service do
  let(:passage_text) { 'passage text' * 50 }
  let(:stem) { 'just because' }
  let(:plagiarism_text) { 'plagiarism plagiarism_text' }
  let(:example_one) { 'example one' }
  let(:example_two) { 'example two' }
  let(:optimal_example_list) { ['some example'] }
  let(:suboptimal_example_list) { ['some other example'] }
  let(:optimal_examples) { optimal_example_list.map { |i| "- #{i}" }.join("\n") }
  let(:suboptimal_examples) { suboptimal_example_list.map { |i| "- #{i}" }.join("\n") }
  let(:plagiarism_texts) { [plagiarism_text].map { |i| "- #{i}" }.join("\n") }

  let(:prompt) { create(:evidence_prompt, text: stem, first_strong_example: example_one, second_strong_example: example_two) }
  let!(:passage) { create(:evidence_passage, text: passage_text, activity: prompt.activity) }
  let(:rule) { create(:evidence_rule, :active, :type_plagiarism) }
  let!(:plagiarism_text_model) { create(:evidence_plagiarism_text, text: plagiarism_text, rule: rule) }
  let!(:prompt_rule) { create(:evidence_prompts_rule, prompt: prompt, rule: rule) }
  let(:history) { [double('History', feedback: 'Sample feedback')] }
  let(:template_file) { 'spec/fixtures/files/sample_system_template.md' }

  before do
    allow(Evidence.feedback_history_class).to receive(:optimal_sample).and_return(optimal_example_list)
    allow(Evidence.feedback_history_class).to receive(:suboptimal_sample).and_return(suboptimal_example_list)
  end

  subject { described_class.new(prompt: prompt, history: history, template_file: template_file) }

  describe '#initialize' do
    it 'initializes with prompt, history, and template_file' do
      expect(subject.prompt).to eq(prompt)
      expect(subject.history).to eq(history)
      expect(subject.template_file).to eq(template_file)
    end
  end

  describe '#run' do
    let(:filled_template) { "Template with passage: #{passage_text}, plagiarism: #{plagiarism_texts}, stem: #{stem}, optimal examples: #{optimal_examples}, suboptimal examples: #{suboptimal_examples}" }

    before do
      allow(File).to receive(:read).and_return('Template with passage: %<passage>s, plagiarism: %<plagiarism_text>s, stem: %<stem>s, optimal examples: %<optimal_examples>s, suboptimal examples: %<suboptimal_examples>s')
    end

    it 'returns the formatted template with the correct variables' do
      expect(subject.run).to eq(filled_template)
    end

    context 'default prod template' do
      subject { described_class.new(prompt: prompt) }

      it 'should not error for prod template' do
        expect { subject.run }.to_not raise_error
      end
    end
  end

  describe 'template methods' do
    it 'fetches the correct template file text' do
      expect(File).to receive(:read).with(subject.send(:template_file_path))
      subject.send(:template_file_text)
    end

    it 'builds the correct template file path' do
      expect(subject.send(:template_file_path).to_s).to include('app/services/evidence/gen_ai/system_prompts/spec/fixtures/files/sample_system_template.md')
    end
  end

  describe 'template variables methods' do
    it 'returns the correct passage' do
      expect(subject.send(:passage)).to eq(passage_text)
    end

    it 'returns the correct plagiarism_text' do
      expect(subject.send(:plagiarism_text)).to eq(plagiarism_texts)
    end

    it 'returns the correct stem' do
      expect(subject.send(:stem)).to eq(stem)
    end

    it 'returns the correct example_one' do
      expect(subject.send(:example_one)).to eq(example_one)
    end

    it 'returns the correct example_two' do
      expect(subject.send(:example_two)).to eq(example_two)
    end
  end
end
