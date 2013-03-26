class CMS::GrammarRule < ActiveRecord::Base
  self.table_name = 'grammar_rules'
  attr_accessible :description, :identifier, :practice_lesson

  belongs_to :author, class_name: 'User'

  def self.name
    'GrammarRule'
  end

  def chunks
    return [] if parsed.blank?
    @chunks ||= ::GrammarChunker.chunk(parsed)
  end

  def parsed
    return nil if practice_lesson.blank?
    @parsed ||= ::GrammarParser.new.parse(practice_lesson)[:questions]
  end
end
