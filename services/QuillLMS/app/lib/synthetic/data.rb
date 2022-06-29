# frozen_string_literal: true

require "google/cloud/translate"
# This API authenticates automagically, by setting the ENV vars for:
# TRANSLATE_PROJECT (project id)
# TRANSLATE_CREDENTIALS (service account json object created in cloud console)
module Synthetic
  class Data
    include Synthetic::ManualTypes

    Result = Struct.new(:text, :label, :translations, :spellings, :type, keyword_init: true) do
      def to_training_rows
        [
          [type, text, label],
          translations.map {|_, new_text| [type, new_text, label]}.flatten(1),
          spellings.map {|_, new_text| [type, new_text, label]}.flatten(1)
        ]
      end

      def to_detail_rows
        [
          [text, label,'','', 'original', type],
          translations.map {|language, new_text| [new_text, label, text, new_text == text ? 'no_change' : '', LANGUAGES[language] || language, type]}.flatten(1),
          spellings.map {|misspelled_word, new_text| [new_text, label, text, new_text == text ? 'no_change' : '', "spelling-#{misspelled_word}", type]}.flatten(1)
        ]
      end
    end

    SPELLING_SUBSTITUTES = Configs[:spelling_substitutes]
    WORD_BOUNDARY = '\b'

    CSV_END_MATCH = /\.csv\z/
    SYNTHETIC_CSV = '_with_synthetic_detail.csv'
    TRAIN_CSV = '_training.csv'

    # Use this https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
    LANGUAGES = {
      es: 'spanish',
      ja:  'japanese',
      pt:  'portugese',
      fi:  'finnish',
      da:  'danish',
      pl:  'polish',
      ar:  'arabic',
      zh:  'chinese',
      he:  'hebrew',
      ko:  'korean',
    }
    TRAIN_LANGUAGES = LANGUAGES.slice(:ko, :he, :ar, :zh, :da)

    ENGLISH = :en
    # the translation API with throw an error if you send too many text strings at a time.
    # Throttling to 100 sentences at a time.
    BATCH_SIZE = 100

    attr_reader :results, :languages, :labels

    # params:
    # texts_and_labels: [['text', 'label_5'],['text', 'label_1'],...]
    # languages: [:es, :ja, ...]
    # manual_types: bool, whether to assign TEXT,VALIDATION,TRAIN to each row
    def initialize(texts_and_labels, languages: TRAIN_LANGUAGES.keys, manual_types: false)
      @languages = languages
      @manual_types = manual_types

      clean_text_and_labels = texts_and_labels
        .keep_if(&:last) # remove blank labels
        .uniq(&:first) # remove duplicate texts

      @labels = clean_text_and_labels.map(&:last).uniq

      # assign results with no TEST,VALIDATION,TRAIN type
      @results = clean_text_and_labels.map do |text_and_label|
        Result.new(
          text: text_and_label.first,
          label: text_and_label.last,
          translations: {},
          spellings: {},
        )
      end

      assign_types if manual_types
    end

    def fetch_synthetic_translations
      languages.each do |language|
        fetch_synthetic_translations_for(language: language)
      end

      results
    end

    def fetch_synthetic_spelling_errors
      spelling_keys = SPELLING_SUBSTITUTES.keys

      results.each do |result|
        spelling_keys.each do |key|
          padded_key = WORD_BOUNDARY + key + WORD_BOUNDARY
          next unless result.text.match?(padded_key)

          # TODO: add randomness to spelling substitutions
          text_with_misspell = result.text.gsub(Regexp.new(padded_key), SPELLING_SUBSTITUTES[key]&.first)
          result.spellings[key] = text_with_misspell
        end
      end

      results
    end

    # only fetch results for items with type 'TRAIN' if using manual_types
    def fetch_synthetic_translations_for(language: )
      results.select {|r| !manual_types || r.type == TYPE_TRAIN}.each_slice(BATCH_SIZE).each do |results_slice|
        translations = translator.translate(results_slice.map(&:text), from: ENGLISH, to: language)
        english_texts = translator.translate(translations.map(&:text), from: language, to: ENGLISH)

        results_slice.each.with_index do |result, index|
          result.translations[language] = english_texts[index].text
        end
      end
    end

    # input file is a csv with two columns and no header: text, label
    # pass in file paths, e.g. /Users/yourname/Desktop/
    def self.generate_from_file(input_file_path, output_file_path, languages: LANGUAGES.keys)
      texts_and_labels = CSV.open(input_file_path).to_a

      synthetics = Synthetic::Data.new(texts_and_labels, languages: languages)

      synthetics.fetch_synthetic_translations
      synthetics.fetch_synthetic_spelling_errors

      synthetics.results_to_csv(output_file_path)
    end

    # input file is a csv with two columns and no header: text, label
    # pass in file paths, e.g. /Users/yourname/Desktop/
    # defaults to a dry run (doesn't hit paid translations endpoint)
    # r = Synthetic::Data.generate_training_export('/Users/danieldrabik/Documents/quill/synthetic/Responses_Translation_Nuclear_Because_Dec13.csv')
    def self.generate_training_export(input_file_path, paid: false, languages: TRAIN_LANGUAGES.keys, manual_types: false, test_percent: 0.2)
      output_csv = input_file_path.gsub(CSV_END_MATCH, SYNTHETIC_CSV)
      output_training_csv = input_file_path.gsub(CSV_END_MATCH, TRAIN_CSV)

      texts_and_labels = CSV.open(input_file_path).to_a

      synthetics = Synthetic::Data.new(texts_and_labels, languages: languages, manual_types: manual_types, test_percent: test_percent)

      if manual_types
        synthetics.validate_minimum_per_label!
        synthetics.validate_language_count_and_percent!
      end

      synthetics.fetch_synthetic_spelling_errors
      synthetics.fetch_synthetic_translations if paid

      synthetics.results_to_csv(output_csv)
      synthetics.results_to_training_csv(output_training_csv)
      synthetics
    end

    # NB, there is a V3, but that throws errors with our current Google Integration
    private def translator
      @translator ||= ::Google::Cloud::Translate.new(version: :v2)
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
