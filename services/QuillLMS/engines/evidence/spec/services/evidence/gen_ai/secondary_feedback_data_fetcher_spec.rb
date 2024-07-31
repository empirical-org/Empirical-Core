# frozen_string_literal: true

require 'rails_helper'
require 'csv'

RSpec.describe Evidence::GenAI::SecondaryFeedbackDataFetcher do
  let(:file_path) { "#{Evidence::Engine.root}/app/services/evidence/gen_ai/secondary_feedback_data/#{file}" }
  let(:file) { described_class::FILE_TRAIN }
  let(:conjunctions) { Evidence::Prompt::CONJUNCTIONS }
  let(:limit) { described_class::UNLIMITED }
  let(:fetcher) { described_class.new(file: file, conjunctions: conjunctions, limit: limit) }
  let(:csv_content) do
    <<~CSV
      activity_id,rule_id,prompt_id,label,conjunction,feedback_primary,feedback_secondary,highlights_secondary,sample_entry
      1,2,3,label_1,because,primary_feedback,secondary_feedback,highlight1|highlight2,sample_1
      4,5,6,label_2,but,primary_feedback_2,secondary_feedback_2,highlight3|highlight4,sample_2
    CSV
  end

  before do
    allow(CSV).to receive(:read).with(file_path, headers: true).and_return(CSV.parse(csv_content, headers: true))
  end

  describe '#initialize' do
    it 'sets the default file to FILE_TRAIN' do
      expect(fetcher.file).to eq(described_class::FILE_TRAIN)
    end

    context 'when a different file is provided' do
      let(:file) { described_class::FILE_TEST }
      let(:fetcher) { described_class.new(file: file, conjunctions: conjunctions, limit: limit) }

      it 'sets the file to the provided value' do
        expect(fetcher.file).to eq(described_class::FILE_TEST)
      end
    end
  end

  describe '#run' do
    let(:conjunctions) { ['because'] }
    let(:limit) { 1 }

    it 'returns an array of SecondaryFeedbackSet objects filtered by conjunction and limited by the provided limit' do
      result = fetcher.run

      expect(result.size).to eq(1)
      expect(result.first).to have_attributes(
        activity_id: 1,
        rule_id: 2,
        prompt_id: 3,
        label: 'label_1',
        conjunction: 'because',
        primary: 'primary_feedback',
        secondary: 'secondary_feedback',
        highlights: ['highlight1', 'highlight2'],
        sample_entry: 'sample_1'
      )
    end
  end

  describe '#file_path' do
    it 'returns the correct file path' do
      expect(fetcher.send(:file_path)).to eq(file_path)
    end
  end

  describe '#dataset_from_row' do
    let(:row) do
      CSV::Row.new(
        %w[activity_id rule_id prompt_id label conjunction feedback_primary feedback_secondary highlights_secondary sample_entry],
        [1, 2, 3, 'label_1', 'because', 'primary_feedback', 'secondary_feedback', 'highlight1|highlight2', 'sample_1']
      )
    end

    it 'returns a SecondaryFeedbackSet object with correct attributes' do
      result = fetcher.send(:dataset_from_row, row)

      expect(result).to have_attributes(
        activity_id: 1,
        rule_id: 2,
        prompt_id: 3,
        label: 'label_1',
        conjunction: 'because',
        primary: 'primary_feedback',
        secondary: 'secondary_feedback',
        highlights: ['highlight1', 'highlight2'],
        sample_entry: 'sample_1'
      )
    end
  end
end
