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

        attr_reader :languages

        def initialize(string_array, options = {})
          super

          @languages = options[:languages] || TRAIN_LANGUAGES
        end

        def generate
          languages.each do |language|
            fetch_synthetic_translations_for(language: language)
          end
        end

        # TODO: only fetch results for items with type 'TRAIN' if using manual_types
        private def fetch_synthetic_translations_for(language: )
          strings.each_slice(BATCH_SIZE).each do |strings_slice|
            begin
              translations = translator.translate(strings_slice, from: ENGLISH, to: language)
              english_texts = translator.translate(Array(translations).map(&:text), from: language, to: ENGLISH)
            rescue => e
              debugger
            end

            strings_slice.each.with_index do |string, index|
              results_hash[string][language.to_s] = Array(english_texts)[index].text
            end
          end
        end

        # NB, there is a V3, but that throws errors with our current Google Integration
        private def translator
          @translator ||= ::Google::Cloud::Translate.new(version: :v2)
        end
      end
    end
  end
end
