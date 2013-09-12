class Chunk
  attr_reader :rule, :chunk, :state

  def initialize rule, options
    @chunk   = rule.chapter.assessment.chunks[options[:id]]
    @rule    = rule

    @word    = options[:word]
    @error   = options[:error]
    @answer  = options[:answer]
    @grammar = options[:grammar]
    @text    = options[:text]
  end

  def grade
    return @result if defined?(@result)

    @result ||= if input? && correct.strip == @input.strip
      @state = if word? then nil else :found end
      true
    elsif !input? && word?
      @state = nil
      true
    else
      @state = if word? then :introduced else :missed end
      false
    end
  end

  def input?
    @input.present? && (@input.strip != word.strip)
  end

private

  def word?
    !!word
  end

  def word
    chunk[:word]
  end

  def correct
    if chunk[:answer] then chunk[:answer] else chunk[:word] end
  end
end
