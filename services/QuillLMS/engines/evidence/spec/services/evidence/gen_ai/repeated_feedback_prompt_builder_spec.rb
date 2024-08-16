# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Evidence::GenAI::RepeatedFeedbackPromptBuilder, type: :service do
  let(:prompt) { double('Prompt', text: 'Explain the causes of World War II.', first_passage: nil) }
  let(:history) { ['Feedback 1', 'Feedback 2'] }
  let(:template_content) { "Template with history:\n%<feedback_history>s" }
  let(:expected_output) { "Template with history:\n- Feedback 1\n- Feedback 2" }
  let(:template_file_path) { Evidence::Engine.root.join("app/services/evidence/gen_ai/repeated_feedback_prompts/#{described_class::DEFAULT_TEMPLATE}") }

  before do
    allow(File).to receive(:read).with(template_file_path).and_return(template_content)
  end

  subject { described_class.new(prompt: prompt, history: history) }

  describe '#run' do
    it 'fills the template with the feedback history' do
      expect(subject.run).to eq(expected_output)
    end
  end

  describe 'private methods' do
    describe '#template_variables' do
      it 'returns a hash with feedback_history' do
        expected_variables = { feedback_history: "- Feedback 1\n- Feedback 2" }
        expect(subject.send(:template_variables)).to eq(expected_variables)
      end
    end

    describe '#default_template' do
      it 'returns the default template filename' do
        expect(subject.send(:default_template)).to eq(described_class::DEFAULT_TEMPLATE)
      end
    end

    describe '#template_folder' do
      it 'returns the template folder path' do
        expect(subject.send(:template_folder)).to eq('app/services/evidence/gen_ai/repeated_feedback_prompts/')
      end
    end
  end
end
