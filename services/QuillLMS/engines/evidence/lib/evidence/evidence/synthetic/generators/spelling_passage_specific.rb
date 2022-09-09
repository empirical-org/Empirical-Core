# frozen_string_literal: true

module Evidence
  module Synthetic
    module Generators
      class SpellingPassageSpecific < Synthetic::Generators::Base

        LONG_WORD_LENGTH = 10
        REGEX_PUNCTUATION = /(\,|\.|\;|\?|\!|\"|\'|\:)/
        REGEX_QUOTES = /(\'|\")/
        REGEX_BRACKETS = /(\(|\)|\[|\])/
        WORD_BOUNDARY = '\b'
        BLANK = ''
        SPACE = ' '

        attr_reader :passage, :random_seed

        def initialize(string_array, options = {})
          super

          @passage = options[:passage] || ""
          @random_seed = options[:random_seed]
        end

        # generate spelling errors for long words in the passage
        def generate
          return if passage.empty?

          strings.each do |string|
            long_words.each do |word|
              padded_word = WORD_BOUNDARY + word + WORD_BOUNDARY
              next unless string.match?(padded_word)

              text_with_misspell = string.gsub(Regexp.new(padded_word), misspell(word))
              results_hash[string][word] = text_with_misspell
            end
          end
        end

        def long_words
          @long_words ||= passage
            .gsub(REGEX_PUNCTUATION, BLANK)
            .gsub(REGEX_QUOTES, BLANK)
            .gsub(REGEX_BRACKETS, BLANK)
            .split(SPACE)
            .select{|w| w.length >= LONG_WORD_LENGTH}
            .uniq
        end

        # drop a random middle character
        # use a seed for sampling to make testing consistent
        def misspell(word)
          random_middle_index = (1...LONG_WORD_LENGTH).to_a.sample(random: random_seed || Random.new)
          word_array = word.split(BLANK)
          word_array.delete_at(random_middle_index)

          word_array.join(BLANK)
        end
      end
    end
  end
end
