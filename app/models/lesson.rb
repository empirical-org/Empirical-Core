class Lesson < ActiveRecord::Base
  attr_accessible :body, :rule_id, :prompt
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
