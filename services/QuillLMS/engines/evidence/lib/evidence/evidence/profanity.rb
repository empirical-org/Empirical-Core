module Evidence 
  class Profanity 
    def self.profane?(word)
      return false unless word.respond_to?(:length) && word.length > 1
      word = word.downcase.gsub(/[.!?]/, '')

      BAD_WORDS.find do |badword|
        stripped_badword = badword.gsub('*', '')
        
        if badword[0] == '*' && badword[-1] == '*'
          regex = ::Regexp.new(stripped_badword)
          return word.match?(regex)
        elsif badword[0] == '*'
          regex = ::Regexp.new("#{stripped_badword}$")
          return word.match?(regex) 
        elsif badword[-1] == '*'
          regex = ::Regexp.new("^#{stripped_badword}")
          return word.match?(regex) 
        else 
          return stripped_badword == word 
        end
      end
    end

  end
end
