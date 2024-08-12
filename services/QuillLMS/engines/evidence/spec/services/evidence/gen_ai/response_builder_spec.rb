# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Evidence::GenAI::ResponseBuilder, type: :service do
  let(:primary_response) { { 'feedback' => 'Sample feedback', 'optimal' => true } }
  let(:secondary_response) { { 'highlight' => '1', 'secondary_feedback' => 'Secondary feedback' } }
  let(:entry) { double('Entry') }
  let(:prompt) { double('Prompt', conjunction: 'because', distinct_automl_highlight_arrays: [['Highlight text 1']]) }
  let(:rule) { double('Rule', concept_uid: 'sample_concept_uid') }

  before do
    allow(Evidence::Rule).to receive(:find_by).and_return(rule)
  end

  subject do
    described_class.new(
      primary_response: primary_response,
      secondary_response: secondary_response,
      entry: entry,
      prompt: prompt
    )
  end

  describe '#initialize' do
    it 'initializes with primary_response, secondary_response, entry, and prompt' do
      expect(subject.primary_response).to eq(primary_response)
      expect(subject.secondary_response).to eq(secondary_response)
      expect(subject.entry).to eq(entry)
      expect(subject.prompt).to eq(prompt)
    end
  end

  describe '#run' do
    it 'returns the response object with correct values' do
      expected_output = {
        feedback: 'Secondary feedback',
        feedback_type: Evidence::Rule::TYPE_GEN_AI,
        optimal: true,
        entry: entry,
        concept_uid: 'sample_concept_uid',
        rule_uid: '35e2312d-ebbf-4408-a83a-5c62913e5d2c',
        hint: nil,
        highlight: [{
          type: Evidence::Highlight::TYPE_PASSAGE,
          text: 'Highlight text 1',
          category: ''
        }]
      }
      expect(subject.run).to eq(expected_output)
    end
  end

  describe 'private methods' do
    describe '#conjunction' do
      it 'returns the conjunction from the prompt' do
        expect(subject.send(:conjunction)).to eq('because')
      end
    end

    describe '#rule' do
      it 'finds the correct rule by uid' do
        expect(Evidence::Rule).to receive(:find_by).with(uid: '35e2312d-ebbf-4408-a83a-5c62913e5d2c')
        subject.send(:rule)
      end
    end

    describe '#rule_uid' do
      it 'returns the correct rule_uid based on the optimal value and conjunction' do
        expect(subject.send(:rule_uid)).to eq('35e2312d-ebbf-4408-a83a-5c62913e5d2c')
      end
    end

    describe '#rule_set' do
      it 'returns the correct rule set based on the optimal value' do
        expect(subject.send(:rule_set)).to eq(described_class::RULES_OPTIMAL)
      end
    end

    describe '#highlight_array' do
      it 'returns the correct highlight text based on the highlight key' do
        expect(subject.send(:highlight_array)).to eq(['Highlight text 1'])
      end
    end

    describe '#highlight' do
      it 'returns the correct highlight array based on the highlight text' do
        expected_highlight = [{
          type: Evidence::Highlight::TYPE_PASSAGE,
          text: 'Highlight text 1',
          category: ''
        }]
        expect(subject.send(:highlight)).to eq(expected_highlight)
      end
    end

    describe '#highlight_key' do
      it 'returns the highlight key from the secondary_response' do
        expect(subject.send(:highlight_key)).to eq('1')
      end
    end

    describe '#optimal' do
      it 'returns the optimal value from the primary_response' do
        expect(subject.send(:optimal)).to eq(true)
      end
    end

    describe '#feedback' do
      it 'returns the feedback from the secondary_response if present, otherwise from primary_response' do
        expect(subject.send(:feedback)).to eq('Secondary feedback')
      end
    end
  end
end
