require "google/cloud/translate"
# This API authenticates automagically, by setting the ENV vars for:
# TRANSLATE_PROJECT (project id)
# TRANSLATE_CREDENTIALS (service account json object created in cloud console)

class GoogleTranslateSynthetic

  SyntheticResult = Struct.new(:original, :label, :translations, keyword_init: true)

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
end
