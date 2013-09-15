class Assessment < ActiveRecord::Base
  belongs_to :chapter
  delegate :questions, to: :chunks

  def chunks
    @chunks ||= GrammarChunker.chunk(parsed)
  end

  def parsed
    @parsed ||= GrammarParser.new.parse(markdown(body.to_s))[:questions]
  end

  def as_json *args
    super.merge({
      rule_position: chapter.rule_position
    })
  end

  private

  def markdown text
    # fake markdown
    text.gsub("\n", "<br>").html_safe
  end
end
