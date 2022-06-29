# frozen_string_literal: true

require 'rails_helper'

describe Synthetic::Data do
  let(:labeled_data) { [['text string', 'label_5'], ['other text', 'label_11']] }
  let(:mock_translator) { double }

  describe '#new' do
    let(:synthetics) { Synthetic::Data.new(labeled_data, languages: [:es])}

    it 'should setup properly with empty translations' do
      expect(synthetics.languages.count).to eq 1
      expect(synthetics.results.count).to eq 2
      expect(synthetics.manual_types).to be false

      first_result = synthetics.results.first

      expect(first_result.text).to eq 'text string'
      expect(first_result.label).to eq 'label_5'
      expect(first_result.translations).to eq({})
      expect(first_result.spellings).to eq({})
    end
  end

  describe '#fetch_synthetic_translations' do
    let(:synthetics) { Synthetic::Data.new(labeled_data, languages: [:es])}

    it 'fetch and store translations' do

      synthetics.stub(:translator).and_return(mock_translator)
      # translate to spanish mock
      expect(mock_translator).to receive(:translate).with(labeled_data.map(&:first), from: :en, to: :es).and_return([double(text: 'adios'), double(text: 'hola')])
      # translate to english mock
      expect(mock_translator).to receive(:translate).with(['adios', 'hola'], from: :es, to: :en).and_return([double(text: 'goodbye'), double(text: 'hello')])

      synthetics.fetch_synthetic_translations

      expect(synthetics.results.count).to eq 2

      first_result = synthetics.results.first

      expect(first_result.text).to eq 'text string'
      expect(first_result.label).to eq 'label_5'
      expect(first_result.translations[:es]).to eq 'goodbye'
    end
  end

  describe '#fetch_synthetic_spelling_errors' do
    let(:labeled_with_spelling) {[['their text', 'label_1'], ['no spelling', 'label_2']]}
    let(:synthetics) { Synthetic::Data.new(labeled_with_spelling)}

    it 'fetch and store translations' do
      synthetics.fetch_synthetic_spelling_errors

      expect(synthetics.results.count).to eq 2

      first_result = synthetics.results.first

      expect(first_result.text).to eq 'their text'
      expect(first_result.label).to eq 'label_1'
      expect(first_result.spellings['their']).to eq 'ther text'
    end
  end

  describe 'data exports' do
    let(:labeled_with_spelling) {[['their text', 'label_1'], ['no spelling', 'label_2']]}
    let(:synthetics) { Synthetic::Data.new(labeled_with_spelling, languages: [:es])}

    before do
      synthetics.stub(:translator).and_return(mock_translator)
      # translate to spanish mock
      allow(mock_translator).to receive(:translate).with(labeled_with_spelling.map(&:first), from: :en, to: :es).and_return([double(text: 'adios'), double(text: 'hola')])
      # translate to english mock
      allow(mock_translator).to receive(:translate).with(['adios', 'hola'], from: :es, to: :en).and_return([double(text: 'goodbye'), double(text: 'hello')])

      synthetics.fetch_synthetic_translations
      synthetics.fetch_synthetic_spelling_errors
    end

    describe "#training_data_rows" do
      it 'should produce an array of arrays to make a csv used for training' do
        training_data = synthetics.training_data_rows
        first_row = training_data.first

        # 2 original, 2 translations, 1 spelling error
        expect(training_data.size).to eq 5
        expect(first_row.size).to eq 3
        expect(first_row[0]).to be nil
        expect(first_row[1]).to eq 'their text'
        expect(first_row[2]).to eq 'label_1'
      end
    end

    describe "#detail_data_rows" do
      it 'should produce an array of arrays to make a csv used for analyzing synthetic data' do
        data = synthetics.detail_data_rows

        # 2 original, 2 translations, 1 spelling error
        expect(data.size).to eq 5
        expect(data.first).to eq(['their text','label_1','','','original', nil])
        expect(data.second).to eq(['goodbye','label_1','their text','','spanish', nil])
        expect(data.third).to eq(['ther text','label_1','their text','','spelling-their', nil])
      end
    end
  end
end
