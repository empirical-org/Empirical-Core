class Assessment < ActiveRecord::Base
  attr_accessible :title, :body, :chapter_id
  belongs_to :chapter

  def chunks
    @chunks ||= ::GrammarChunker.chunk(parsed)
  end

  def parsed
    @parsed ||= ::GrammarParser.new.parse(body)[:questions]
  end
end
