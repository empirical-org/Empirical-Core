module Evidence 
  class Profanity 
    def self.is_profane(word)
      return false unless word.respond_to?(:length) && word.length > 1
      word.downcase! 

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