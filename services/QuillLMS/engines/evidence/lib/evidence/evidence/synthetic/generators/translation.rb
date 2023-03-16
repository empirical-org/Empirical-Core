# frozen_string_literal: true

require "google/cloud/translate"

module Evidence
  module Synthetic
    module Generators
      # This API authenticates automagically, by setting the ENV vars for:
      # TRANSLATE_PROJECT (project id)
      # TRANSLATE_CREDENTIALS (service account json object created in cloud console)
      class Translation < Synthetic::Generators::Base

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

        attr_reader :languages, :passage

        def initialize(string_array, options = {})
          super

          @languages = options[:languages] || TRAIN_LANGUAGES
          @passage = HTMLTagRemover.run(options[:passage] || "")
        end

        def generate
          languages.each do |language|
            fetch_synthetic_translations_for(language: language)
          end
        end

        # TODO: only fetch results for items with type 'TRAIN' if using manual_types
        private def fetch_synthetic_translations_for(language: )
          strings.each_slice(BATCH_SIZE).each do |strings_slice|
            translations = Array(translator.translate(strings_slice, from: ENGLISH, to: language))
            english_texts = Array(translator.translate(translations.map(&:text), from: language, to: ENGLISH))

            strings_slice.each.with_index do |string, index|
              result = lowercaser.run(english_texts[index].text)

              generator = Evidence::Synthetic::Generator.new(
                name: 'Translation',
                source_text: string,
                language: language.to_s,
                results: [result],
              )
              results_hash[string].append(generator)
            end
          end
        end

        # NB, there is a V3, but that throws errors with our current Google Integration
        private def translator
          @translator ||= ::Google::Cloud::Translate.new(version: :v2)
        end

        private def lowercaser
          @lowercaser ||= Evidence::SafeFirstLowercaser.new(passage)
        end
      end
    end
  end
end
