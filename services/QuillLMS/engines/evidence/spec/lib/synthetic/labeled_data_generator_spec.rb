# frozen_string_literal: true

require 'rails_helper'

describe Evidence::Synthetic::LabeledDataGenerator do
  let(:text1) {'text string'}
  let(:label1) {'label_5'}
  let(:text2) {'other text'}
  let(:labeled_data) { [[text1, label1], [text2, 'label_11']] }

  let(:mock_translator) { double }

  let(:translation_generator1) { Evidence::Synthetic::Generator.new(name: 'Translation', results: ['goodbye'], language: 'es')}
  let(:translation_generator2) { Evidence::Synthetic::Generator.new(name: 'Translation', results: ['korean'], language: 'ko')}
  let(:translation_generator3) { Evidence::Synthetic::Generator.new(name: 'Translation', results: ['goodbye 2'], language: 'es')}
  let(:translation_generator4) { Evidence::Synthetic::Generator.new(name: 'Translation', results: ['korean 2'], language: 'ko')}


  let(:translation_response) do
    {
      text1 => [translation_generator1, translation_generator2],
      text2 => [translation_generator3, translation_generator4]
    }
  end

  let(:spelling_generator) { Evidence::Synthetic::Generator.new(name: 'Spelling', results: ['ther response'], word: 'their')}

  let(:spelling_response) do
    {
      text1 => [spelling_generator]
    }
  end

  let(:paraphrase_generator) { Evidence::Synthetic::Generator.new(name: 'LabelParaphrase', results: ['word string', 'sentence string'], word: 'their')}

  let(:paraphrase_response) do
    {
      text1 => [paraphrase_generator]
    }
  end

  describe '#new' do
    subject { described_class.new(labeled_data, languages: [:es])}

    it 'should setup properly with empty translations' do
      expect(subject.languages.count).to eq 1
      expect(subject.results.count).to eq 2
      expect(subject.manual_types).to be false

      first_result = subject.results.first

      expect(first_result.text).to eq 'text string'
      expect(first_result.label).to eq 'label_5'
      expect(first_result.generated).to eq([])
    end

    context 'nil entries' do
      let(:labeled_data) { [[text1, label1], [nil, 'label_11'], [text2, nil]] }

      it 'should remove empty results and load' do
        expect(subject.results.count).to eq 1

        first_result = subject.results.first

        expect(first_result.text).to eq 'text string'
        expect(first_result.label).to eq 'label_5'
        expect(first_result.generated).to eq([])
      end
    end
  end

  describe '#run translation' do
    subject { described_class.run(labeled_data, languages: [:es], generators: [:translation])}

    it 'fetch and store translations' do
      expect(Evidence::Synthetic::Generators::Translation).to receive(:run).with([text1, text2], {:languages=>[:es], passage: nil}).and_return(translation_response)
      expect(subject.results.count).to eq 2

      first_result = subject.results.first

      expect(first_result.text).to eq text1
      expect(first_result.label).to eq label1

      generator1 = first_result.generated.first

      expect(generator1.results).to eq(['goodbye'])
      expect(generator1.name).to eq 'Translation'
      expect(generator1.language).to eq('es')
    end
  end

  describe '#run spelling errors' do
    subject { described_class.run(labeled_data, languages: [:es], generators: [:spelling])}

    it 'fetch and store spelling errors' do
      expect(Evidence::Synthetic::Generators::Spelling).to receive(:run).with([text1, text2], {:languages=>[:es], passage: nil}).and_return(spelling_response)
      expect(subject.results.count).to eq 2

      first_result = subject.results.first

      expect(first_result.text).to eq text1
      expect(first_result.label).to eq label1

      generator = first_result.generated.first

      expect(generator.results).to eq(['ther response'])
      expect(generator.name).to eq 'Spelling'
      expect(generator.word).to eq('their')
    end
  end


  describe '#run paraphrase' do
    let(:passage) {'passage text'}
    subject { described_class.run(labeled_data, generators: [:paraphrase], languages: [:es], passage: passage)}

    it 'fetch and store paraphrases' do
      expect(Evidence::Synthetic::Generators::Paraphrase).to receive(:run)
        .with([text1, text2], {:languages=>[:es], passage: passage})
        .and_return(paraphrase_response)

      expect(subject.results.count).to eq 2

      first_result = subject.results.first

      expect(first_result.text).to eq text1
      expect(first_result.label).to eq label1

      generator = first_result.generated.first

      expect(generator.results).to eq(['word string', 'sentence string'])
      expect(generator.name).to eq 'LabelParaphrase'
    end
  end

  describe '#run spelling-passage-specific errors' do
    let(:text1) {'the dancing step'}
    let(:text2) {'the dancing'}
    let(:text3) {'the dancing other'}
    let(:passage) {"passage text #{'dancing '* 5}"}

    let(:data) {[[text1,label1], [text2,label1], [text3,label1]]}

    before do
      stub_const("Evidence::Synthetic::ManualTypes::MIN_TRAIN_PER_LABEL", 1)
      stub_const("Evidence::Synthetic::ManualTypes::MIN_TEST_PER_LABEL", 1)
    end

    subject { described_class.run(data, generators: [:spelling_passage_specific], passage: passage)}

    it 'fetch and store spelling changes' do
      expect(subject.results.count).to eq 3

      first_result = subject.results.first

      expect(first_result.text).to eq text1
      expect(first_result.label).to eq label1

      generator = first_result.generated.first

      expect(generator.results).to be_present
      expect(generator.name).to eq 'SpellingPassage'
    end

    context 'manual types' do
      let(:generator) { described_class.run(data, generators: [:spelling_passage_specific], passage: passage, manual_types: true) }

      context 'test types' do
        subject { generator.results.find {|r| r.type == "TEST"} }

        it 'should populate passage errors' do
          expect(subject.generated.first.name).to eq 'SpellingPassage'
        end
      end

      context 'validation types' do
        subject { generator.results.find {|r| r.type == "VALIDATION"} }

        it 'should populate passage errors' do
          expect(subject.generated.first.name).to eq 'SpellingPassage'
        end
      end
    end
  end

  describe 'data exports' do
    let(:generator) { described_class.run(labeled_data, languages: [:es], generators: [:translation, :spelling])}

    before do
      allow(Evidence::Synthetic::Generators::Translation).to receive(:run).with([text1, text2], {:languages=>[:es], passage: nil}).and_return(translation_response)
      allow(Evidence::Synthetic::Generators::Spelling).to receive(:run).with([text1, text2], {:languages=>[:es], passage: nil}).and_return(spelling_response)
    end

    describe "#training_data_rows" do
      it 'should produce an array of arrays to make a csv used for training' do
        training_data = generator.training_data_rows
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
        data = generator.detail_data_rows

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

  describe "#self.csvs_from_run" do
    let(:filename) { 'some_activity_but.csv' }
    let(:automl_name) {'some_activity_but_synthetic_automl_upload.csv'}

    before do
      stub_const("Evidence::Synthetic::LabeledDataGenerator::DEFAULT_LANGUAGES", [:es])
      stub_const("Evidence::Synthetic::ManualTypes::MIN_TEST_PER_LABEL", 0)
      stub_const("Evidence::Synthetic::ManualTypes::MIN_TRAIN_PER_LABEL", 0)

      allow(Evidence::Synthetic::Generators::Translation).to receive(:run).with([text1, text2], {:languages=>[:es], passage: nil}).and_return(translation_response)
      allow(Evidence::Synthetic::Generators::Spelling).to receive(:run).with([text1, text2], {:languages=>[:es], passage: nil}).and_return(spelling_response)
    end

    it "should generate a hash of csv_strings" do
      output = described_class.csvs_from_run(labeled_data, filename)

      expect(output.class).to be Hash
      expect(output.keys).to eq([
        automl_name,
        'some_activity_but_synthetic_analysis.csv',
        'some_activity_but_synthetic_original.csv'
      ])

      # values should be a multi-line valid CSV
      csv = CSV.parse(output[automl_name])
      expect(csv.size).to be 7
      first_row = csv.first
      expect(first_row.first).to(satisfy {|v| v.in?(["TRAIN", "TEST", "VALIDATION"])})
      expect(first_row.second).to eq text1
      expect(first_row.last).to eq label1
    end
  end
end
