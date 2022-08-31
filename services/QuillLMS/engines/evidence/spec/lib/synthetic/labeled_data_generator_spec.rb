# frozen_string_literal: true

require 'rails_helper'

describe Evidence::Synthetic::LabeledDataGenerator do
  let(:text1) {'text string'}
  let(:label1) {'label_5'}
  let(:text2) {'other text'}
  let(:labeled_data) { [[text1, label1], [text2, 'label_11']] }
  let(:mock_translator) { double }

  let(:translation_response) do
    {
      text1 => {'es' => 'goodbye', 'ko' => 'korean'},
      text2 => {'es' => 'goodbye 2', 'ko' => 'korean 2'}
    }
  end

  let(:spelling_response) do
    {
      text1 => {'their' => 'ther response'}
    }
  end

  describe '#new' do
    let(:synthetics) { Evidence::Synthetic::LabeledDataGenerator.new(labeled_data, languages: [:es])}

    it 'should setup properly with empty translations' do
      expect(synthetics.languages.count).to eq 1
      expect(synthetics.results.count).to eq 2
      expect(synthetics.manual_types).to be false

      first_result = synthetics.results.first

      expect(first_result.text).to eq 'text string'
      expect(first_result.label).to eq 'label_5'
      expect(first_result.generated).to eq({})
    end
  end

  describe '#run translation' do
    let(:synthetics) { Evidence::Synthetic::LabeledDataGenerator.run(labeled_data, languages: [:es], generators: [:translation])}

    it 'fetch and store translations' do
      expect(Evidence::Synthetic::Generators::Translation).to receive(:run).with([text1, text2], {:languages=>[:es]}).and_return(translation_response)
      expect(synthetics.results.count).to eq 2

      first_result = synthetics.results.first

      expect(first_result.text).to eq text1
      expect(first_result.label).to eq label1
      expect(first_result.generated[:translation]['es']).to eq 'goodbye'
    end
  end

  describe '#run spelling errors' do
    let(:synthetics) { Evidence::Synthetic::LabeledDataGenerator.run(labeled_data, languages: [:es], generators: [:spelling])}

    it 'fetch and store translations' do
      expect(Evidence::Synthetic::Generators::Spelling).to receive(:run).with([text1, text2], {:languages=>[:es]}).and_return(spelling_response)
      expect(synthetics.results.count).to eq 2

      first_result = synthetics.results.first

      expect(first_result.text).to eq text1
      expect(first_result.label).to eq label1
      expect(first_result.generated[:spelling]['their']).to eq 'ther response'
    end
  end

  describe 'data exports' do
    let(:synthetics) { Evidence::Synthetic::LabeledDataGenerator.run(labeled_data, languages: [:es], generators: [:translation, :spelling])}

    before do
      allow(Evidence::Synthetic::Generators::Translation).to receive(:run).with([text1, text2], {:languages=>[:es]}).and_return(translation_response)
      allow(Evidence::Synthetic::Generators::Spelling).to receive(:run).with([text1, text2], {:languages=>[:es]}).and_return(spelling_response)
    end

    describe "#training_data_rows" do
      it 'should produce an array of arrays to make a csv used for training' do
        training_data = synthetics.training_data_rows
        first_row = training_data.first

        # 2 original, 4 translations, 1 spelling error
        expect(training_data.size).to eq 7
        # every row should have 3 columns
        expect(training_data.map(&:size).uniq).to eq [3]
        expect(first_row[0]).to be nil
        expect(first_row[1]).to eq text1
        expect(first_row[2]).to eq label1
      end
    end

    describe "#detail_data_rows" do
      it 'should produce an array of arrays to make a csv used for analyzing synthetic data' do
        data = synthetics.detail_data_rows

        # 2 original, 4 translations, 1 spelling error
        expect(data.size).to eq 7
        # every row should have 6 columns
        expect(data.map(&:size).uniq).to eq [6]
        expect(data[0]).to eq([text1,label1,'','','original', nil])
        expect(data[1]).to eq(['goodbye',label1, text1,'','translation-es', nil])
        expect(data[2]).to eq(['korean',label1,text1,'','translation-ko', nil])
        expect(data[3]).to eq(['ther response',label1, text1,'','spelling-their', nil])
      end
    end
  end
end
