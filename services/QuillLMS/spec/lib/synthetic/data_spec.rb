# frozen_string_literal: true

require 'rails_helper'

describe Synthetic::Data do
  let(:labeled_data) { [['text string', 'label_5'], ['other text', 'label_11']] }

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
      expect(first_result.misspellings).to eq({})
    end
  end

  describe '#fetch_synthetic_translations' do
    let(:mock_translator) { double() }
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
    let(:mock_translator) { double() }
    let(:synthetics) { Synthetic::Data.new(labeled_with_spelling)}

    it 'fetch and store translations' do

      # synthetics.stub(:translator).and_return(mock_translator)
      # # translate to spanish mock
      # expect(mock_translator).to receive(:translate).with(labeled_data.map(&:first), from: :en, to: :es).and_return([double(text: 'adios'), double(text: 'hola')])
      # # translate to english mock
      # expect(mock_translator).to receive(:translate).with(['adios', 'hola'], from: :es, to: :en).and_return([double(text: 'goodbye'), double(text: 'hello')])

      synthetics.fetch_synthetic_spelling_errors

      expect(synthetics.results.count).to eq 2

      first_result = synthetics.results.first

      expect(first_result.text).to eq 'their text'
      expect(first_result.label).to eq 'label_1'
      expect(first_result.misspellings['their']).to eq 'ther text'
    end
  end
end
