module GrammarChunker
  def chunk parsed
    parsed.inject([]) do |memo, val|
      val[:before].to_s.split(/\s+/).reject(&:blank?).each do |word|
        memo << {word: word}
      end

      memo << ::GrammarQuestion.new( val[:question].inject({}){ |m,v| m.merge(v) } )

      val[:after].to_s.split(/\s+/).reject(&:blank?).each do |word|
        memo << {word: word}
      end

      memo
    end
  end

  extend self
end
