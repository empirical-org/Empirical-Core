# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Evidence::GenAI::ResponseBuilder, type: :service do
  let(:primary_response) { { 'feedback' => 'Sample feedback', 'optimal' => true } }
  let(:secondary_response) { {} }
  let(:entry) { double('Entry') }
  let(:optimal_label_feedback) { 'Great work!' }
  let(:prompt) { double('Prompt', conjunction: 'because', distinct_automl_highlight_arrays: [['Highlight text 1']], optimal_label_feedback:) }
  let(:rule) { double('Rule', concept_uid: 'sample_concept_uid') }

  let(:optimal_response) do
    {
      feedback: optimal_label_feedback,
      feedback_type: Evidence::Rule::TYPE_GEN_AI,
      optimal: true,
      entry: entry,
      concept_uid: 'sample_concept_uid',
      rule_uid: '35e2312d-ebbf-4408-a83a-5c62913e5d2c',
      hint: nil,
      highlight: []
    }
  end

  let(:suboptimal_response) do
    {
      feedback: 'Sample feedback',
      feedback_type: Evidence::Rule::TYPE_GEN_AI,
      optimal: false,
      entry: entry,
      concept_uid: 'sample_concept_uid',
      rule_uid: '62c6af4d-fcea-4ea7-b9c6-3e74035f0ce2',
      hint: nil,
      highlight: []
    }
  end

  let(:suboptimal_secondary_response) do
    {
      feedback: 'Secondary feedback',
      feedback_type: Evidence::Rule::TYPE_GEN_AI,
      optimal: false,
      entry: entry,
      concept_uid: 'sample_concept_uid',
      rule_uid: '62c6af4d-fcea-4ea7-b9c6-3e74035f0ce2',
      hint: nil,
      highlight: [{
        type: Evidence::Highlight::TYPE_PASSAGE,
        text: 'Highlight text 1',
        category: ''
      }]
    }
  end

  before do
    allow(Evidence::Rule).to receive(:find_by).and_return(rule)
  end

  subject { described_class.new(primary_response:, secondary_response:, entry:, prompt:) }

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
      expect(subject.run).to eq(optimal_response)
    end

    context 'suboptimal' do
      let(:primary_response) { { 'feedback' => 'Sample feedback', 'optimal' => false } }

      it { expect(subject.run).to eq(suboptimal_response) }

      context 'with secondary feedback' do
        let(:secondary_response) { { 'secondary_feedback' => 'Secondary feedback', 'highlight' => '1' } }

        it { expect(subject.run).to eq(suboptimal_secondary_response) }
      end
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
        expect(subject.send(:highlight_array)).to eq([])
      end
    end

    describe '#highlight' do
      it 'returns the correct highlight array based on the highlight text' do
        expect(subject.send(:highlight)).to eq([])
      end
    end

    describe '#highlight_key' do
      it 'returns the highlight key from the secondary_response' do
        expect(subject.send(:highlight_key)).to be_nil
      end
    end

    describe '#optimal' do
      it 'returns the optimal value from the primary_response' do
        expect(subject.send(:optimal)).to eq(true)
      end
    end

    describe '#feedback' do
      it 'returns the optimal feedback' do
        expect(subject.send(:feedback)).to eq(optimal_label_feedback)
      end
    end
  end
end
