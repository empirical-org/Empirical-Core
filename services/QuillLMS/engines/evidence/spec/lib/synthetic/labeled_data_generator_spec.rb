# frozen_string_literal: true

require 'rails_helper'

describe Evidence::Synthetic::LabeledDataGenerator do
  let(:text1) {'text string'}
  let(:label1) {'label_5'}
  let(:text2) {'other text'}
  let(:labeled_data) { [[text1, label1], [text2, 'label_11']] }

  let(:mock_translator) { double }

  let(:spanish_generation) { create(:evidence_text_generation, type: 'Translation', language: 'es') }
  let(:korean_generation) {  create(:evidence_text_generation, type: 'Translation', language: 'ko') }

  let(:translation_generator1) { Evidence::Synthetic::GeneratorResults.new(generator: spanish_generation, results: ['goodbye'])}
  let(:translation_generator2) { Evidence::Synthetic::GeneratorResults.new(generator: korean_generation, results: ['korean'])}
  let(:translation_generator3) { Evidence::Synthetic::GeneratorResults.new(generator: spanish_generation, results: ['goodbye 2'])}
  let(:translation_generator4) { Evidence::Synthetic::GeneratorResults.new(generator: korean_generation,  results: ['korean 2'])}


  let(:translation_response) do
    {
      text1 => [translation_generator1, translation_generator2],
      text2 => [translation_generator3, translation_generator4]
    }
  end

  let(:spelling_generation) { create(:evidence_text_generation, type: 'Spelling', word: 'their') }
  let(:spelling_generator) { Evidence::Synthetic::GeneratorResults.new(generator: spelling_generation, results: ['ther response'])}

  let(:spelling_response) do
    {
      text1 => [spelling_generator]
    }
  end

  let(:paraphrase_generation) { create(:evidence_text_generation, type: 'Paraphrase', temperature: 1, source_text: 'noun string') }
  let(:paraphrase_generator) { Evidence::Synthetic::GeneratorResults.new(generator: paraphrase_generation, results: ['word string', 'sentence string'])}

  let(:paraphrase_response) do
    {
      text1 => [paraphrase_generator]
    }
  end

  let(:activity) { create(:evidence_activity, :with_prompt_and_passage) }
  let(:prompt)  { activity.prompts.first }
  let(:passage) { activity.passages.first }

  describe '#new' do
    subject { described_class.new(labeled_data, prompt: prompt, languages: [:es])}

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
    subject { described_class.run(labeled_data, prompt: prompt, languages: [:es], generators: [:translation])}

    it 'fetch and store translations' do
      expect(Evidence::Synthetic::Generators::Translation).to receive(:run).with([text1, text2], {:languages=>[:es], passage: passage.text}).and_return(translation_response)
      expect(subject.results.count).to eq 2

      first_result = subject.results.first

      expect(first_result.text).to eq text1
      expect(first_result.label).to eq label1

      generator_results1 = first_result.generated.first

      expect(generator_results1.results).to eq(['goodbye'])
      expect(generator_results1.generator.type).to eq 'Translation'
      expect(generator_results1.generator.language).to eq('es')
      expect(Evidence::PromptText.count).to eq 6
    end
  end

  describe '#run spelling errors' do
    subject { described_class.run(labeled_data, prompt: prompt, languages: [:es], generators: [:spelling])}

    it 'fetch and store spelling errors' do
      expect(Evidence::Synthetic::Generators::Spelling).to receive(:run).with([text1, text2], {:languages=>[:es], passage: passage.text}).and_return(spelling_response)
      expect(subject.results.count).to eq 2

      first_result = subject.results.first

      expect(first_result.text).to eq text1
      expect(first_result.label).to eq label1

      generator_results = first_result.generated.first

      expect(generator_results.results).to eq(['ther response'])
      expect(generator_results.generator.type).to eq 'Spelling'
      expect(generator_results.generator.word).to eq('their')
    end
  end


  describe '#run paraphrase' do
    subject { described_class.run(labeled_data, prompt: prompt, generators: [:paraphrase], languages: [:es])}

    it 'fetch and store paraphrases' do
      expect(Evidence::Synthetic::Generators::Paraphrase).to receive(:run)
        .with([text1, text2], {:languages=>[:es], passage: passage.text})
        .and_return(paraphrase_response)

      expect(subject.results.count).to eq 2

      first_result = subject.results.first

      expect(first_result.text).to eq text1
      expect(first_result.label).to eq label1

      generator_results = first_result.generated.first

      expect(generator_results.results).to eq(['word string', 'sentence string'])
      expect(generator_results.generator.type).to eq 'Paraphrase'
    end
  end

  describe '#run spelling-passage-specific errors' do
    let(:text1) {'the dancing step'}
    let(:text2) {'the dancing'}
    let(:text3) {'the dancing other'}

    let(:passage_text) { "passage text goes here #{'dancing '* 5}" }
    let(:activity) { create(:evidence_activity) }
    let!(:passage) { create(:evidence_passage, text: passage_text, activity: activity)}
    let(:prompt) { create(:evidence_prompt, activity: activity)}

    let(:data) {[[text1,label1], [text2,label1], [text3,label1]]}

    before do
      stub_const("Evidence::Synthetic::ManualTypes::MIN_TRAIN_PER_LABEL", 1)
      stub_const("Evidence::Synthetic::ManualTypes::MIN_TEST_PER_LABEL", 1)
    end

    subject { described_class.run(data, prompt: prompt, generators: [:spelling_passage_specific])}

    it 'fetch and store spelling changes' do
      expect(subject.results.count).to eq 3

      first_result = subject.results.first

      expect(first_result.text).to eq text1
      expect(first_result.label).to eq label1

      generator_results = first_result.generated.first

      expect(generator_results.results).to be_present
      expect(generator_results.generator.type).to eq 'SpellingPassage'
    end

    context 'manual types' do
      let(:generator) { described_class.run(data,prompt: prompt, generators: [:spelling_passage_specific], manual_types: true) }

      context 'test types' do
        subject { generator.results.find {|r| r.type == "TEST"} }

        it 'should populate passage errors' do
          expect(subject.generated.first.generator.type).to eq 'SpellingPassage'
        end
      end

      context 'validation types' do
        subject { generator.results.find {|r| r.type == "VALIDATION"} }

        it 'should populate passage errors' do
          expect(subject.generated.first.generator.type).to eq 'SpellingPassage'
        end
      end
    end
  end

  describe 'data exports' do
    let(:generator) { described_class.run(labeled_data, prompt: prompt, languages: [:es], generators: [:translation, :spelling])}

    before do
      allow(Evidence::Synthetic::Generators::Translation).to receive(:run).with([text1, text2], {:languages=>[:es], passage: passage.text}).and_return(translation_response)
      allow(Evidence::Synthetic::Generators::Spelling).to receive(:run).with([text1, text2], {:languages=>[:es], passage: passage.text}).and_return(spelling_response)
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

      allow(Evidence::Synthetic::Generators::Translation).to receive(:run).with([text1, text2], {:languages=>[:es], passage: passage.text}).and_return(translation_response)
      allow(Evidence::Synthetic::Generators::Spelling).to receive(:run).with([text1, text2], {:languages=>[:es], passage: passage.text}).and_return(spelling_response)
    end

    it "should generate a hash of csv_strings" do
      output = described_class.csvs_from_run(labeled_data, filename, prompt)

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
