module GrammarChunker
  def chunk parsed
    parsed.inject(Chunks.new) do |memo, val|
      val[:before].to_s.split(/\s+/).reject(&:blank?).each do |word|
        memo << {word: word}
      end

      question = GrammarQuestion.new( val[:question].inject({}){ |m,v| m.merge(v) } )
      memo           << question
      memo.questions << question

      val[:after].to_s.split(/\s+/).reject(&:blank?).each do |word|
        memo << {word: word}
      end

      memo
    end
  end

  class Chunks < Array
    def questions
      @questions ||= []
    end
  end

  extend self
end
