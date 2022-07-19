module Synthetic
  module Generators
    class Spelling < Synthetic::Generators::Base

      SPELLING_SUBSTITUTES = Configs[:spelling_substitutes]
      WORD_BOUNDARY = '\b'

      def generate
        spelling_keys = SPELLING_SUBSTITUTES.keys

        strings.each do |string|
          spelling_keys.each do |key|
            padded_key = WORD_BOUNDARY + key + WORD_BOUNDARY
            next unless string.match?(padded_key)

            # TODO: add randomness to spelling substitutions
            text_with_misspell = string.gsub(Regexp.new(padded_key), SPELLING_SUBSTITUTES[key]&.first)
            results_hash[string][key] = text_with_misspell
          end
        end
      end
    end
  end
end



