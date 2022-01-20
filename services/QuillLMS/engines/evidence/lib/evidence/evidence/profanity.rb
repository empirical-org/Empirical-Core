# frozen_string_literal: true

module Evidence
  class Profanity

    def self.profane?(entry)
      # find the badword substrings that exist in the entry
      found_bad_words = BadWords::ALL.select do |word|
        entry.downcase.include?(word.gsub('*',''))
      end

      return false if found_bad_words.empty?
      
      # do a more rigorous word-by-word check if bad word stems detected
      profane_word_check?(entry)
    end

    def self.profane_word_check?(entry, bad_words = BadWords::ALL)
      return false unless entry.is_a?(String) && entry.length > 1
      entry = entry.downcase.gsub(/[.!?]/, '')

      a_match = bad_words.any? do |badword|
        match?(badword: badword, entry: entry)
      end
    end

    def self.match?(badword:, entry:)
      stripped_badword = badword.gsub('*', '')
      if badword.start_with?('*') && badword.end_with?('*')
        regex = ::Regexp.new(stripped_badword)
        entry.match?(regex)
      elsif badword.start_with?('*')
        regex = ::Regexp.new("#{stripped_badword}$")
        entry.match?(regex)
      elsif badword.end_with?('*')
        regex = ::Regexp.new("^#{stripped_badword}")
        entry.match?(regex)
      else
         entry.match(stripped_badword)
      end
    end

  end
end
