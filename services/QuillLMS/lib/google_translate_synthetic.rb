require "google/cloud/translate"
# This API authenticates automagically, by setting the ENV vars for:
# TRANSLATE_PROJECT (project id)
# TRANSLATE_CREDENTIALS (service account json object created in cloud console)

class GoogleTranslateSynthetic

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
  # the API with throw an error if you send too many text strings at a time.
  # Throttling to 100 sentences at a time.
  BATCH_SIZE = 100

  attr_reader :synthetics, :languages

  def initialize(texts_and_labels, languages: DEFAULT_LANGUAGES.keys)
    @languages = languages
    @synthetics = texts_and_labels.map do |text_and_label|
      Synthetic.new(text: text_and_label.first, label: text_and_label.last, results: {})
    end
  end

  def fetch_results
    languages.each do |language|
      fetch_results_for(language: language)
    end

    synthetics
  end

  def fetch_results_for(language: )
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
  def self.generate_from_file(input_file_path, output_file_path)
    texts_and_labels = CSV.open(input_file_path).to_a

    synthetics = GoogleTranslateSynthetic.new(texts_and_labels)

    synthetics.fetch_results

    CSV.open(output_file_path, "w") do |csv|
      csv << ['Text', 'Label', 'Original', 'Changed?', 'Language',]
      synthetics.synthetics.each do |synthetic|
          csv << [synthetic.text, synthetic.label,'','', 'original']
        synthetic.results.each do |language, new_text|
          csv << [new_text, synthetic.label, synthetic.text, new_text == synthetic.text ? 'no_change' : '', DEFAULT_LANGUAGES[language] || language]
        end
      end
    end
  end
end
