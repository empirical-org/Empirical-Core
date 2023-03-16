# frozen_string_literal: true

module Evidence
  module Synthetic
    module Generators
      class Spelling < Synthetic::Generators::Base

        SPELLING_SUBSTITUTES = Evidence::Configs.from_yml(:spelling_substitutes)
        WORD_BOUNDARY = '\b'

        def generate
          spelling_keys = SPELLING_SUBSTITUTES.keys

          strings.each do |string|
            spelling_keys.each do |spelling_key|
              padded_key = WORD_BOUNDARY + spelling_key + WORD_BOUNDARY
              next unless string.match?(padded_key)

              # TODO: add randomness to spelling substitutions
              text_with_misspell = string.gsub(Regexp.new(padded_key), SPELLING_SUBSTITUTES[spelling_key]&.first)
              results_hash[string][spelling_key] = text_with_misspell
            end
          end
        end
      end
    end
  end
end
