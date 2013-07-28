class Assessment < ActiveRecord::Base
  attr_accessible :body, :chapter_id
  belongs_to :chapter

  def chunks
    @chunks ||= ::GrammarChunker.chunk(parsed)
  end

  def parsed
    @parsed ||= ::GrammarParser.new.parse(markdown(body.to_s))[:questions]
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
