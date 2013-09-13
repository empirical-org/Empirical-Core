class Chunk
  attr_reader :chapter, :chunk, :state, :input
  delegate :rule, to: :@chunk
  delegate :classification, to: :rule

  def initialize chapter, options
    @chapter = chapter
    @chunk   = chapter.assessment.chunks[options[:id]]

    @word    = options[:word]
    @error   = options[:error]
    @answer  = options[:answer]
    @grammar = options[:grammar]
    @text    = options[:text]
    @input   = options[:input]
  end

  def grade!
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
    return true if @input.present? && word.blank?
    @input.present? && (@input.strip != word.strip)
  end

  def classification
    if state == :introduced
      nil
    else
      rule.classification
    end
  end

private

  def word?
    !!word
  end

  def word
    chunk[:word]
  end

  def correct
    (if chunk[:answer] then chunk[:answer] else chunk[:word] end).to_s
  end
end
