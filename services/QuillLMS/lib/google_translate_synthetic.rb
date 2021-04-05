require "google/cloud/translate"
# This API authenticates automagically, by setting the ENV vars for:
# TRANSLATE_PROJECT (project id)
# TRANSLATE_CREDENTIALS (service account json object created in cloud console)

class GoogleTranslateSynthetic

  SyntheticResult = Struct.new(:original, :label, :translations, keyword_init: true)
  TrainRow = Struct.new(:text, :label, :synthetic, :type, keyword_init: true) do
    def to_a
      [type, text, label]
    end
  end
  TYPE_TRAIN = 'TRAIN'
  TYPE_VALIDATION = 'VALIDATION'
  TYPE_TEST = 'TEST'
  TEST_PERCENTAGE = 0.10


  # NB, there is a V3, but that throws errors with our current Google Integration
  TRANSLATOR = Google::Cloud::Translate.new(version: :v2)
  # Use this https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
  DEFAULT_LANGUAGES = {
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
  TRAIN_LANGUAGES = DEFAULT_LANGUAGES.slice(:ko, :he, :ar, :zh)

  ENGLISH = :en
  # the API with throw an error if you send too many text strings at a time.
  # Throttling to 100 sentences at a time.
  BATCH_SIZE = 100

  attr_reader :results, :languages

  # params:
  # texts_and_labels: [['text', 'label_5'],['text', 'label_1'],...]
  # languages: [:es, :ja, ...]
  def initialize(texts_and_labels, languages: DEFAULT_LANGUAGES.keys)
    @languages = languages
    @results = texts_and_labels.map do |text_and_label|
      SyntheticResult.new(original: text_and_label.first, label: text_and_label.last, translations: {})
    end
  end

  def fetch_results
    languages.each do |language|
      fetch_results_for(language: language)
    end

    results
  end

  def fetch_results_for(language: )
    results.each_slice(BATCH_SIZE).each do |results_slice|
      translations = TRANSLATOR.translate(results_slice.map(&:original), from: ENGLISH, to: language)
      english_texts = TRANSLATOR.translate(translations.map(&:text), from: language, to: ENGLISH)

      results_slice.each.with_index do |result, index|
        result.translations[language] = english_texts[index].text
      end
    end
  end

  # input file is a csv with two columns and no header: text, label
  # pass in file paths, e.g. /Users/yourname/Desktop/
  def self.generate_from_file(input_file_path, output_file_path, languages: DEFAULT_LANGUAGES.keys)
    texts_and_labels = CSV.open(input_file_path).to_a

    synthetics = GoogleTranslateSynthetic.new(texts_and_labels, languages: languages)

    synthetics.fetch_results

    CSV.open(output_file_path, "w") do |csv|
      csv << ['Text', 'Label', 'Original', 'Changed?', 'Language']
      synthetics.results.each do |result|
          csv << [result.original, result.label,'','', 'original']
        result.translations.each do |language, new_text|
          csv << [new_text, result.label, result.original, new_text == result.original ? 'no_change' : '', DEFAULT_LANGUAGES[language] || language]
        end
      end
    end
  end

  def self.generate_training_export(input_file_path, output_file_path, languages: TRAIN_LANGUAGES.keys)
    raise if languages.size > 4

    texts_and_labels = CSV.open(input_file_path).to_a

    synthetics = GoogleTranslateSynthetic.new(texts_and_labels, languages: languages)

    synthetics.fetch_results

    data = []
    synthetics.results.each do |result|
      data << TrainRow.new(text: result.original, label: result.label, synthetic: false, type: nil)
      result.translations.each do |_, new_text|
        data << TrainRow.new(text: new_text, label: result.label, synthetic: true, type: TYPE_TRAIN)
      end
    end

    # remove duplicates
    uniq_data = data.uniq
    # determine how many test items
    test_count = (uniq_data.size * TEST_PERCENTAGE).ceil
    # determine original counts
    original_count = uniq_data.count {|data| data.type.nil? }
    #assign test and validations
    original_types = type_list(count: original_count, test_count: test_count).shuffle

    uniq_data.each do |train_row|
      next unless train_row.type.nil?

      train_row.type = original_types.shift
    end

    CSV.open(output_file_path, "w") do |csv|
      uniq_data.each {|row| csv << row.to_a }
    end
  end

  private_class_method def self.type_list(count: , test_count:)
    [
      Array.new(test_count, TYPE_TEST),
      Array.new(test_count, TYPE_VALIDATION),
      Array.new(count - (test_count * 2), TYPE_TRAIN)
    ].flatten
  end
end
