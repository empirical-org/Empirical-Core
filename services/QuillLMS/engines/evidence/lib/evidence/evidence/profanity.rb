module Evidence
  class Profanity

    def self.profane?(entry)
      flagged_words = BadWords::ALL.select do |word|
        entry.include?(word.gsub('*',''))
      end

      return false if flagged_words.empty?

      entry.split(' ').any? { |word| profane_word_check?(word, flagged_words)}
    end

    # keeping this for now for comparison and benchmarking
    def self.profane_legacy?(entry)
      entry.split(' ').any? { |word| profane_word_check?(word)}
    end

    def self.profane_word_check?(word, bad_words = BadWords::ALL)
      return false unless word.is_a?(String) && word.length > 1
      word = word.downcase.gsub(/[.!?]/, '')

      a_match = bad_words.any? do |badword|
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
