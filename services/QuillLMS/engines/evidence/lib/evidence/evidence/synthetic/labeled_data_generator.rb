# frozen_string_literal: true

module Evidence
  module Synthetic
    class LabeledDataGenerator < ApplicationService
      include Synthetic::ManualTypes

      CSV_END_MATCH = /\.csv\z/
      SYNTHETIC_CSV = '_with_synthetic_detail.csv'
      TRAIN_CSV = '_training.csv'

      # To add a generator:
      # 1) Subclass Synthetic::Generators::Base
      # 2) Write a 'generate' function (also overwrite 'initialize' if you need passed-in options)
      # 3) Add type and class to this mapping
      GENERATORS = {
        translation: Synthetic::Generators::Translation,
        spelling: Synthetic::Generators::Spelling
      }

      FREE_GENERATORS = GENERATORS.except(:translations)

      attr_reader :results, :languages, :labels, :generators

      # params:
      # texts_and_labels: [['text', 'label_5'],['text', 'label_1'],...]
      # languages: [:es, :ja, ...]
      # manual_types: bool, whether to assign TEXT,VALIDATION,TRAIN to each row
      def initialize(texts_and_labels, languages: TRAIN_LANGUAGES.keys, generators: GENERATORS.keys, manual_types: false)
        @languages = languages
        @manual_types = manual_types
        @generators = GENERATORS.slice(*generators)

        clean_text_and_labels = texts_and_labels
          .keep_if(&:last) # remove blank labels
          .uniq(&:first) # remove duplicate texts

        @labels = clean_text_and_labels.map(&:last).uniq

        # assign results with no TEST,VALIDATION,TRAIN type
        @results = clean_text_and_labels.map do |text_and_label|
          Synthetic::LabeledResult.new(
            text: text_and_label.first, # text is a unique ID
            label: text_and_label.last,
            generated: {}
          )
        end

        assign_types if manual_types
      end

      def run
        generators.each do |type, generator|
          results_hash = generator.run(results.map(&:text), languages: languages)

          results.each do |result|
            result.generated[type] = results_hash[result.text] || {}
          end
        end

        self
      end

      LABEL_FILE = 'synthetic_labeled'
      LABEL_ORIGINAL = 'original.csv'
      LABEL_TRAINING = 'automl_upload.csv'
      LABEL_ANALYSIS = 'analysis.csv'

      def self.csvs_from_run(texts_and_labels, filename)
        generator = Evidence::Synthetic::LabeledDataGenerator.new(
          texts_and_labels,
          manual_types: true,
        )

        generator.run

        generator.csv_file_hash(filename, file)
      end

      def self.csv_file_hash(filename, file)
        {
          file_name(filename, LABEL_TRAINING) => generator.training_csv_string,
          file_name(filename, LABEL_ANALYSIS) => generator.analysis_csv_string
        }
      end

      def self.file_name(filename, file_ending)
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
    end
  end
end
