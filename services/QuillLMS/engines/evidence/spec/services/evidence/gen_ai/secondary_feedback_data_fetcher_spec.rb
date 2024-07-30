# frozen_string_literal: true

require 'rails_helper'
require 'csv'

RSpec.describe Evidence::GenAI::SecondaryFeedbackDataFetcher do
  let(:file_path) { "#{Evidence::Engine.root}/app/services/evidence/gen_ai/secondary_feedback_data/#{file}" }
  let(:file) { described_class::FILE_TRAIN }
  let(:fetcher) { described_class.new(file) }
  let(:csv_content) do
    <<~CSV
      activity_id,rule_id,prompt_id,label,conjunction,feedback_primary,feedback_secondary,highlights_secondary,sample_entry
      1,2,3,label_1,and,primary_feedback,secondary_feedback,highlight1|highlight2,sample_1
      4,5,6,label_2,or,primary_feedback_2,secondary_feedback_2,highlight3|highlight4,sample_2
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
      let(:fetcher) { described_class.new(file) }

      it 'sets the file to the provided value' do
        expect(fetcher.file).to eq(described_class::FILE_TEST)
      end
    end
  end

  describe '#run' do
    it 'returns an array of FeedbackSet objects' do
      result = fetcher.run

      expect(result.size).to eq(2)
      expect(result.first).to have_attributes(
        activity_id: 1,
        rule_id: 2,
        prompt_id: 3,
        label: 'label_1',
        conjunction: 'and',
        primary: 'primary_feedback',
        secondary: 'secondary_feedback',
        highlights: ['highlight1', 'highlight2'],
        sample_entry: 'sample_1'
      )
      expect(result.last).to have_attributes(
        activity_id: 4,
        rule_id: 5,
        prompt_id: 6,
        label: 'label_2',
        conjunction: 'or',
        primary: 'primary_feedback_2',
        secondary: 'secondary_feedback_2',
        highlights: ['highlight3', 'highlight4'],
        sample_entry: 'sample_2'
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
        [1, 2, 3, 'label_1', 'and', 'primary_feedback', 'secondary_feedback', 'highlight1|highlight2', 'sample_1']
      )
    end

    it 'returns a FeedbackSet object with correct attributes' do
      result = fetcher.send(:dataset_from_row, row)

      expect(result).to have_attributes(
        activity_id: 1,
        rule_id: 2,
        prompt_id: 3,
        label: 'label_1',
        conjunction: 'and',
        primary: 'primary_feedback',
        secondary: 'secondary_feedback',
        highlights: ['highlight1', 'highlight2'],
        sample_entry: 'sample_1'
      )
    end
  end
end
