# frozen_string_literal: true

module Evidence
  module Synthetic
    module Generators
      class SpellingPassageSpecific < Synthetic::Generators::Base

        REPEATED_WORD_COUNT = 5
        REPEATED_WORD_MIN_LENGTH = 5
        REGEX_PUNCTUATION = /(,|\.|;|\?|!|"|'|:)/
        REGEX_QUOTES = /('|")/
        REGEX_BRACKETS = /(\(|\)|\[|\])/
        WORD_BOUNDARY = '\b'
        BLANK = ''
        SPACE = ' '

        attr_reader :passage, :random_seed

        def initialize(string_array, options = {})
          super

          @passage = HTMLTagRemover.run(options[:passage] || "")
          @random_seed = options[:random_seed]
        end

        # generate spelling errors for long words in the passage
        def generate
          return if passage.empty?

          strings.each do |string|
            repeated_words.each do |word|
              padded_word = WORD_BOUNDARY + word + WORD_BOUNDARY
              next unless string.match?(padded_word)

              text_with_misspell = string.gsub(Regexp.new(padded_word), misspell(word))
              results_hash[string][word] = text_with_misspell
            end
          end
        end

        def repeated_words
          @repeated_words ||= passage_words
            .tally
            .select {|_,count| count >= REPEATED_WORD_COUNT}
            .keys
            .select {|w| w.length >= REPEATED_WORD_MIN_LENGTH}
        end

        def passage_words
          passage
            .gsub(REGEX_PUNCTUATION, BLANK)
            .gsub(REGEX_QUOTES, BLANK)
            .gsub(REGEX_BRACKETS, BLANK)
            .split(SPACE)
        end

        # drop a random middle character
        # use a seed for sampling to make testing consistent
        def misspell(word)
          random_middle_index = (1...word.length).to_a.sample(random: random_seed || Random.new)
          word_array = word.split(BLANK)
          word_array.delete_at(random_middle_index)

          word_array.join(BLANK)
        end
      end
    end
  end
end
