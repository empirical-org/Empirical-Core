require "google/cloud/translate"
# This API authenticates automagically, by setting the ENV vars for:
# TRANSLATE_PROJECT (project id)
# TRANSLATE_CREDENTIALS (service account json object created in cloud console)

class GoogleTranslate

  Synthetic = Struct.new(:text, :label, :results, keyword_init: true)

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
  ENGLISH = :en
  BATCH_SIZE = 100
  TEST_INPUT = '/Users/danieldrabik/Downloads/surge_barriers_test.csv'
  TEST_OUTPUT = '/Users/danieldrabik/Downloads/surge_barriers_test_output.csv'

  attr_reader :synthetics, :languages

  def initialize(texts_and_labels, languages: DEFAULT_LANGUAGES.keys)
    @languages = languages
    @synthetics = texts_and_labels.map do |text_and_label|
      Synthetic.new(text: text_and_label.first, label: text_and_label.last, results: {})
    end
  end

  def fetch_results
    languages.each do |language|
      synthetics_for_language(language: language)
    end

    synthetics
  end

  def synthetics_for_language(language: )
    synthetics.each_slice(BATCH_SIZE).each do |synthetics_slice|
      translations = TRANSLATOR.translate(synthetics_slice.map(&:text), from: ENGLISH, to: language)
      english_texts = TRANSLATOR.translate(translations.map(&:text), from: language, to: ENGLISH)

      synthetics_slice.each.with_index do |synthetic, index|
        synthetic.results[language] = english_texts[index].text
      end
    end
  end

  # input file is a csv with two columsn and no: text, label
  # pass in a file path, e.g. /Users/yourname/Desktop/
  def self.synthetics_from_file(input_file_path, output_file_path)
    texts_and_labels = CSV.open(input_file_path).to_a

    synthetics = GoogleTranslate.new(texts_and_labels)

    synthetics.fetch_results

    CSV.open(output_file_path, "w") do |csv|
      csv << ['Text', 'Label', 'Language', 'Original', 'Changed?']
      synthetics.synthetics.each do |synthetic|
          csv << [synthetic.text, synthetic.label, 'original']
        synthetic.results.each do |language, new_text|
          csv << [new_text, synthetic.label, DEFAULT_LANGUAGES[language] || language, synthetic.text, new_text == synthetic.text ? 'no_change' : '']
        end
      end
    end
  end


  def self.synthetics_from_file(input_file_path, output_file_path)
    texts_and_labels = CSV.open(input_file_path).to_a

    csv_output = synthetics_for_languages(texts_and_labels)

    CSV.open(output_file_path, "w") do |csv|
      csv_output.each do |row|
        csv << row
      end
    end
  end

  def self.synthetics_for_languages(texts_and_labels, languages: DEFAULT_LANGUAGES.keys)
    texts = texts_and_labels.map(&:first)

    output = []
    languages.each do |language|
      synthetics = synthetics_for_language(texts, language: language)
      transposed_texts_and_labels = synthetics.map.with_index do |text, index|
        [text, texts_and_labels[index].last]
      end

      output += transposed_texts_and_labels
    end

    output
  end


  def self.synthetics_for_language(texts, language: )
    output = []
    texts.each_slice(BATCH_SIZE).each do |text_slice|

      translations = TRANSLATOR.translate(text_slice, from: ENGLISH, to: language)
      english_texts = TRANSLATOR.translate(translations.map(&:text), from: language, to: ENGLISH)

      output += english_texts.map(&:text)
    end

    output
  end
end
