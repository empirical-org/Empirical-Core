require "google/cloud/translate"
# This API authenticates automagically, by setting the ENV vars for:
# TRANSLATE_PROJECT (project id)
# TRANSLATE_CREDENTIALS (service account json object created in cloud console)
module Synthetic
  class Data

    class NotEnoughData < StandardError; end;

    Result = Struct.new(:text, :label, :translations, :misspellings, :type, keyword_init: true)
    TrainRow = Struct.new(:text, :label, :synthetic, :type, keyword_init: true) do
      def to_a
        [type, text, label]
      end
    end
    TYPE_TRAIN = 'TRAIN'
    TYPE_VALIDATION = 'VALIDATION'
    TYPE_TEST = 'TEST'

    SPELLING_SUBSTITUTES = Configs[:spelling_substitutes]
    WORD_BOUNDARY = '\b'

    CSV_END_MATCH = /\.csv\z/
    SYNTHETIC_CSV = '_with_synthetic_detail.csv'
    TRAIN_CSV = '_training.csv'
    MIN_AUTOML_TEST_PERCENT = 0.05
    MIN_TEST_PER_LABEL = 10
    MIN_TRAIN_PER_LABEL = 50

    # NB, there is a V3, but that throws errors with our current Google Integration
    TRANSLATOR = ::Google::Cloud::Translate.new(version: :v2)
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
    # the API with throw an error if you send too many text strings at a time.
    # Throttling to 100 sentences at a time.
    BATCH_SIZE = 100

    attr_reader :results, :languages, :test_percent, :data_count, :labels, :manual_types

    # params:
    # texts_and_labels: [['text', 'label_5'],['text', 'label_1'],...]
    # languages: [:es, :ja, ...]
    # test_percent: float. What percent should be used for both the test and validation set
    # manual_types: bool, whether to assign TEXT,VALIDATION,TRAIN to each row
    # Passing 0.2 will use 20% for testing, 20% for validation and 60% for training
    def initialize(texts_and_labels, languages: TRAIN_LANGUAGES.keys, spelling: true, manual_types: true, test_percent: 0.2)
      @languages = languages
      @test_percent = test_percent
      @manual_types = manual_types

      clean_text_and_labels = texts_and_labels
        .keep_if(&:last) # remove blank labels
        .uniq(&:first) # remove duplicate texts

      @data_count = clean_text_and_labels.size

      @labels = clean_text_and_labels.map(&:last).uniq

      # assign results with no TEST,VALIDATION,TRAIN type
      @results = clean_text_and_labels.map do |text_and_label|
        Result.new(
          text: text_and_label.first,
          label: text_and_label.last,
          translations: {},
          misspellings: {}
        )
      end

      fetch_synthetic_spelling_errors

      assign_types if manual_types
    end

    def assign_types
      # assign TEST and VALIDATION types to each label to ensure minimum per label
      labels.each do |label|
        testing_sample = @results
          .select {|r| r.label == label }
          .sample(MIN_TEST_PER_LABEL * 2)

        # ensure minimum-sized TEST and VALIDATION sets per label
        testing_sample.each.with_index do |result, index|
          result.type = index.odd? ? TYPE_TEST : TYPE_VALIDATION
        end

        training_sample = @results
          .select {|r| r.label == label && r.type.nil? }
          .sample(MIN_TRAIN_PER_LABEL)

        # ensure minimum-sized TRAIN set per label
        training_sample.each do |result|
          result.type = TYPE_TRAIN
        end
      end

      assigned_tests = MIN_TEST_PER_LABEL * labels.size
      assigned_train = MIN_TRAIN_PER_LABEL * labels.size

      if assigned_tests > test_count
        raise NotEnoughData, "Test Needed: #{assigned_tests}, allocated: #{test_count}"
      end

      if assigned_train > train_count
        raise NotEnoughData, "Train Needed: #{assigned_train}, allocated: #{train_count}"
      end

      remaining_types = [
        Array.new(test_count - assigned_tests, TYPE_TEST),
        Array.new(test_count - assigned_tests, TYPE_VALIDATION),
        Array.new(train_count - assigned_train, TYPE_TRAIN)
      ].flatten.shuffle

      # assign rest of empty types
      @results.select {|r| r.type.nil?}.each.with_index do |result, index|
        # TODO: There's some bug with this counting logic, so default to TRAIN
        result.type = remaining_types[index] || TYPE_TRAIN
      end
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

          text_with_mispell = result.text.gsub(Regexp.new(padded_key), SPELLING_SUBSTITUTES[key])
          result.misspellings[key] = text_with_mispell
        end
      end

      results
    end

    # only fetch results for items with type 'TRAIN' if using manual_types
    def fetch_synthetic_translations_for(language: )
      results.select {|r| !manual_types || r.type == TYPE_TRAIN}.each_slice(BATCH_SIZE).each do |results_slice|
        translations = TRANSLATOR.translate(results_slice.map(&:text), from: ENGLISH, to: language)
        english_texts = TRANSLATOR.translate(translations.map(&:text), from: language, to: ENGLISH)

        results_slice.each.with_index do |result, index|
          result.translations[language] = english_texts[index].text
        end
      end
    end

    def train_count
      data_count - (test_count * 2)
    end

    def test_count
      (data_count * test_percent).ceil
    end

    # input file is a csv with two columns and no header: text, label
    # pass in file paths, e.g. /Users/yourname/Desktop/
    def self.generate_from_file(input_file_path, output_file_path, languages: LANGUAGES.keys)
      texts_and_labels = CSV.open(input_file_path).to_a

      synthetics = Synthetic::Data.new(texts_and_labels, languages: languages)

      synthetics.fetch_synthetic_translations

      synthetics.results_to_csv(output_file_path)
    end

    # input file is a csv with two columns and no header: text, label
    # pass in file paths, e.g. /Users/yourname/Desktop/
    # defaults to a dry run (doesn't hit)
    # r = Synthetic::Data.generate_training_export('/Users/danieldrabik/Documents/quill/synthetic/Responses_Translation_Nuclear_Because_Dec13.csv')
    def self.generate_training_export(input_file_path, live: false, languages: TRAIN_LANGUAGES.keys, manual_types: true, test_percent: 0.2)

      output_csv = input_file_path.gsub(CSV_END_MATCH, SYNTHETIC_CSV)
      output_training_csv = input_file_path.gsub(CSV_END_MATCH, TRAIN_CSV)

      texts_and_labels = CSV.open(input_file_path).to_a

      synthetics = Synthetic::Data.new(texts_and_labels, languages: languages, manual_types: manual_types, test_percent: test_percent)

      if manual_types
        synthetics.validate_minimum_per_label!
        synthetics.validate_language_count_and_percent!
      end

      if live
        synthetics.fetch_synthetic_translations
      end

      synthetics.results_to_csv(output_csv)
      synthetics.results_to_training_csv(output_training_csv)
      synthetics
    end

    def results_to_training_csv(file_path)
      data = []
      results.each do |result|
        data << TrainRow.new(text: result.text, label: result.label, synthetic: false, type: result.type)
        result.translations.each do |_, new_text|
          data << TrainRow.new(text: new_text, label: result.label, synthetic: true, type: result.type)
        end
        result.misspellings.each do |_, new_text|
          data << TrainRow.new(text: new_text, label: result.label, synthetic: true, type: result.type)
        end
      end

      CSV.open(file_path, "w") do |csv|
        data.uniq.each {|row| csv << row.to_a }
      end
    end

    def results_to_csv(file_path)
      CSV.open(file_path, "w") do |csv|
        csv << ['Text', 'Label', 'Original', 'Changed?', 'Language/Spelling', 'Type']
        results.each do |result|
            csv << [result.text, result.label,'','', 'original', result.type]
          result.translations.each do |language, new_text|
            csv << [new_text, result.label, result.text, new_text == result.text ? 'no_change' : '', LANGUAGES[language] || language, result.type]
          end

          result.misspellings.each do |misspelled_word, new_text|
            csv << [new_text, result.label, result.text, new_text == result.text ? 'no_change' : '', "spelling-#{misspelled_word}", result.type]
          end
        end
      end
    end

    # We need the test and validation sets to be above 5%
    def validate_language_count_and_percent!
      training_percent = 1 - (test_percent * 2)

      training_size = (training_percent * (languages.count + 1)) * results.size
      test_size = test_percent * results.size

      total_size = (test_size * 2) + training_size

      return if (test_size / total_size) >= MIN_AUTOML_TEST_PERCENT

      raise NotEnoughData, "Training Size: #{training_size}, Total Size: #{total_size}, Test Percent #{(test_percent / total_size)}, Misspell Size: #{misspelling_size}"
    end

    def validate_minimum_per_label!
      invalid_labels = labels.select do |label|
        results.count {|r| r.label == label && r.type == TYPE_VALIDATION } < MIN_TEST_PER_LABEL ||
        results.count {|r| r.label == label && r.type == TYPE_TEST } < MIN_TEST_PER_LABEL ||
        results.count {|r| r.label == label && r.type == TYPE_TRAIN } < MIN_TRAIN_PER_LABEL
      end

      return if invalid_labels.empty?

      raise NotEnoughData, "There is not enough data for labels: #{invalid_labels.join(',')}"
    end
  end
end
