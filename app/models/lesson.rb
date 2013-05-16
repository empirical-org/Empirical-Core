class Lesson < ActiveRecord::Base
  attr_accessible :body, :chapter_id, :order, :rule_id
  belongs_to :chapter
  belongs_to :rule

  def chunks
    return [] if parsed.blank?
    @chunks ||= ::GrammarChunker.chunk(parsed)
  end

  def parsed
    return nil if body.blank?
    @parsed ||= ::GrammarParser.new.parse(body)[:questions]
  end

end
