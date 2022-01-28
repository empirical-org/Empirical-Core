# frozen_string_literal: true

module Evidence
  class Profanity

    # Returns: string | nil
    def self.profane(entry)
      # find the badword substrings that exist in the entry
      found_bad_words = BadWords::ALL.select do |word|
        entry.downcase.include?(word.gsub('*',''))
      end

      return nil if found_bad_words.empty?

      # do a more rigorous word-by-word check for found bad words
      entry.split.find { |word| profane_word_check(word, found_bad_words)}
    end

    def self.profane_word_check(word, bad_words = BadWords::ALL)
      return nil unless word.is_a?(String) && word.length > 1

      word = word.downcase.gsub(/[.!?]/, '')

      a_match = bad_words.find do |badword|
        match?(badword: badword, word: word)
      end
    end

    def self.match?(badword:, word:)
      stripped_badword = badword.gsub('*', '')
      if badword.start_with?('*') && badword.end_with?('*')
        regex = ::Regexp.new(stripped_badword)
        word.match?(regex)
      elsif badword.start_with?('*')
        regex = ::Regexp.new("#{stripped_badword}$")
        word.match?(regex)
      elsif badword.end_with?('*')
        regex = ::Regexp.new("^#{stripped_badword}")
        word.match?(regex)
      else
        stripped_badword == word
      end
    end

  end
end
