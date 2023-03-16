# frozen_string_literal: true

module Evidence
  module Synthetic
    class LabeledDataGenerator < ApplicationService
      include ActiveModel::Validations
      include Synthetic::ManualTypes

      CSV_END_MATCH = /\.csv\z/
      SYNTHETIC_CSV = '_with_synthetic_detail.csv'
      TRAIN_CSV = '_training.csv'

      # To add a generator:
      # 1) Subclass Synthetic::Generators::Base
      # 2) Write a 'generate' function (also overwrite 'initialize' if you need passed-in options)
      # 3) Add type and class to this mapping
      GENERATORS = {
        paraphrase: Synthetic::Generators::Paraphrase,
        translation: Synthetic::Generators::Translation,
        spelling: Synthetic::Generators::Spelling,
        spelling_passage_specific: Synthetic::Generators::SpellingPassageSpecific
      }

      DEFAULT_GENERATORS = GENERATORS.slice(:translation, :spelling, :spelling_passage_specific)

      TEST_GENERATOR_KEYS = [:spelling_passage_specific]

      FREE_GENERATORS = GENERATORS.except(:translations, :paraphrase)
      DEFAULT_LANGUAGES = Evidence::Synthetic::Generators::Translation::TRAIN_LANGUAGES.keys

      attr_reader :results, :languages, :labels, :generators, :passage

      # params:
      # texts_and_labels: [['text', 'label_5'],['text', 'label_1'],...]
      # languages: [:es, :ja, ...]
      # manual_types: bool, whether to assign TEXT,VALIDATION,TRAIN to each row
      def initialize(texts_and_labels, languages: DEFAULT_LANGUAGES, generators: DEFAULT_GENERATORS.keys, passage: nil, manual_types: false)
        @languages = languages
        @manual_types = manual_types
        @generators = GENERATORS.slice(*generators)
        @passage = passage if passage

        clean_text_and_labels = labeled_data_cleaner(texts_and_labels)

        @labels = clean_text_and_labels.map(&:last).uniq

        # assign results with no TEST,VALIDATION,TRAIN type
        @results = clean_text_and_labels.map do |text_and_label|
          Synthetic::LabeledResult.new(
            text: text_and_label.first, # text is a unique ID
            label: text_and_label.last,
            generated: []
          )
        end

        assign_types if manual_types
      end

      def run
        run_generators(generators, results_training)

        if manual_types
          run_generators(test_generators, results_test_validation)
        end

        self
      end
      # generated
      # {'their originial response' => [Generated(spelling)]}
      def run_generators(generator_hash, results_set)
        generator_hash.each do |type, generator|
          results_hash = generator.run(results_set.map(&:text), languages: languages, passage: passage)

          results_set.each do |result|
            array_for_result = results_hash[result.text] || []
            result.generated.concat(array_for_result)
          end
        end
      end

      def results_training
        return results unless manual_types

        results.select {|r| r.type == TYPE_TRAIN}
      end

      def test_generators
        generators.slice(*TEST_GENERATOR_KEYS)
      end

      def results_test_validation
        return results unless manual_types

        results.select {|r| r.type == TYPE_VALIDATION || r.type == TYPE_TEST}
      end

      LABEL_FILE = 'synthetic'
      LABEL_ORIGINAL = 'original.csv'
      LABEL_TRAINING = 'automl_upload.csv'
      LABEL_ANALYSIS = 'analysis.csv'

      def self.csvs_from_run(texts_and_labels, filename, passage = nil)
        generator = Evidence::Synthetic::LabeledDataGenerator.new(
          texts_and_labels,
          manual_types: true,
          passage: passage
        )

        generator.run

        generator.csv_file_hash(filename, texts_and_labels)
      end

      def csv_file_hash(filename, texts_and_labels)
        {
          file_name(filename, LABEL_TRAINING) => training_csv_string,
          file_name(filename, LABEL_ANALYSIS) => analysis_csv_string,
          file_name(filename, LABEL_ORIGINAL) => CSV.generate {|csv| texts_and_labels.each {|row| csv << row }}
        }
      end

      def file_name(filename, file_ending)
        [filename.gsub('.csv',''), LABEL_FILE, file_ending].join('_')
      end

      def training_csv_string
        CSV.generate do |csv|
          training_data_rows.uniq.each {|row| csv << row }
        end
      end

      def analysis_csv_string
        CSV.generate do |csv|
          csv << ['Text', 'Label', 'Original', 'Changed?', 'Language/Spelling', 'Type']
          detail_data_rows.each {|row| csv << row }
        end
      end

      def training_data_rows
        results
          .map(&:to_training_rows)
          .flatten(1)
          .reject(&:empty?)
      end

      def detail_data_rows
        results
          .map(&:to_detail_rows)
          .flatten(1)
          .reject(&:empty?)
      end

      private def labeled_data_cleaner(texts_and_labels)
        texts_and_labels
          .keep_if(&:last) # remove blank labels
          .keep_if(&:first) # remove blank texts
          .uniq(&:first) # remove duplicate texts
      end
    end
  end
end
