# frozen_string_literal: true

module Synthetic
  class Data < ApplicationService
    include Synthetic::ManualTypes

    CSV_END_MATCH = /\.csv\z/
    SYNTHETIC_CSV = '_with_synthetic_detail.csv'
    TRAIN_CSV = '_training.csv'

    # To add a generator:
    # 1) Subclass Synthetic::Generators::Base
    # 2) Write a 'generate' function (overwrite initialize if you need passed-in options)
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
        Synthetic::Result.new(
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

    # input file is a csv with two columns and no header: text, label
    # pass in file paths, e.g. /Users/yourname/Desktop/
    def self.generate_from_file(input_file_path, output_file_path, languages: LANGUAGES.keys)
      texts_and_labels = CSV.open(input_file_path).to_a

      synthetics = Synthetic::Data.new(texts_and_labels, languages: languages)

      synthetics.run

      synthetics.results_to_csv(output_file_path)
    end

    # input file is a csv with two columns and no header: text, label
    # pass in file paths, e.g. /Users/yourname/Desktop/
    # defaults to a dry run (doesn't hit paid translations endpoint)
    # r = Synthetic::Data.generate_training_export('/Users/danieldrabik/Documents/quill/synthetic/Responses_Translation_Nuclear_Because_Dec13.csv')
    def self.generate_training_export(input_file_path, paid: false, languages: TRAIN_LANGUAGES.keys, manual_types: false)
      output_csv = input_file_path.gsub(CSV_END_MATCH, SYNTHETIC_CSV)
      output_training_csv = input_file_path.gsub(CSV_END_MATCH, TRAIN_CSV)

      texts_and_labels = CSV.open(input_file_path).to_a

      generators = paid ? GENERATORS.keys : FREE_GENERATORS.keys

      synthetics = Synthetic::Data.new(
        texts_and_labels,
        languages: languages,
        manual_types: manual_types,
        generators: generators
      )

      if manual_types
        synthetics.validate_minimum_per_label!
        synthetics.validate_language_count_and_percent!
      end

      synthetics.run

      synthetics.results_to_csv(output_csv)
      synthetics.results_to_training_csv(output_training_csv)
      synthetics
    end

    def results_to_training_csv(file_path)
      CSV.open(file_path, "w") do |csv|
        training_data_rows.uniq.each {|row| csv << row }
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

    def results_to_csv(file_path)
      CSV.open(file_path, "w") do |csv|
        csv << ['Text', 'Label', 'Original', 'Changed?', 'Language/Spelling', 'Type']
        detail_data_rows.each {|row| csv << row }
      end
    end
  end
end
