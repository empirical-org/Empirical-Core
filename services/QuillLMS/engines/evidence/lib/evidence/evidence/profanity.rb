module Evidence 
  class Profanity 
    def self.profane?(word)
      return false unless word.is_a?(String) && word.length > 1
      word = word.downcase.gsub(/[.!?]/, '')

      a_match = BadWords::ALL.find do |badword|
        match?(badword: badword, word: word)
      end
      a_match ? true : false
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
