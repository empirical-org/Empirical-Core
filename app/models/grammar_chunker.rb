module GrammarChunker
  def chunk parsed
    parsed.inject(Chunks.new) do |memo, val|
      split_words(val[:before]).each do |word|
        memo << {word: word}
      end

      question = GrammarQuestion.new(val[:question].inject({}) { |m,v| m.merge(v) })
      memo           << question
      memo.questions << question

      split_words(val[:after]).each do |word|
        memo << {word: word}
      end

      memo
    end
  end

  def split_words text
    Array.wrap(text.to_s)
      .map { |s| s.split(/(<br>)/) }.flatten
      .map { |s| s.split(/\s+/) }.flatten
      .reject(&:blank?)
  end

  class Chunks < Array
    def questions
      @questions ||= []
    end
  end

  extend self
end
