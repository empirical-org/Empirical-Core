module Synthetic
  module Generators
    # This API authenticates automagically, by setting the ENV vars for:
    # TRANSLATE_PROJECT (project id)
    # TRANSLATE_CREDENTIALS (service account json object created in cloud console)
    class Translation < ApplicationService

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

      attr_reader :results_hash, :languages


      # takes an array of unique strings ['string1 data sample', 'sample 2']
      # returns a hash of the form:
      # {'string1 data sample' => {'es' => 'hola, amigo', 'ko' => 'translated to korean'}, 'sample 2' =>...}
      def initialize(string_array, options = {})
        # create and hash with each string  to an empty hash, e.g.
        # {'string' => {}, 'string 2' => {}
        @results_hash = Hash[string_array.map {|string| [string,{}] }]
        @languages = options[:languages] || TRAIN_LANGUAGES
      end

      def run
        fetch_synthetic_translations
      end

      private def fetch_synthetic_translations
        languages.each do |language|
          fetch_synthetic_translations_for(language: language)
        end

        results_hash
      end

      private def strings
        results_hash.keys
      end

      # only fetch results for items with type 'TRAIN' if using manual_types
      private def fetch_synthetic_translations_for(language: )
        strings.each_slice(BATCH_SIZE).each do |strings_slice|
          translations = translator.translate(strings_slice, from: ENGLISH, to: language)
          english_texts = translator.translate(translations.map(&:text), from: language, to: ENGLISH)

          strings_slice.each.with_index do |string, index|
            results_hash[string][language.to_s] = english_texts[index].text
          end
        end
      end

      private def translator
        @translator ||= ::Google::Cloud::Translate.new(version: :v2)
      end

    end # end class
  end
end



