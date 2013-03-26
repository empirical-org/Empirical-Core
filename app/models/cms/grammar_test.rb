class CMS::GrammarTest < ActiveRecord::Base
  self.table_name = 'grammar_tests'
  attr_accessible :text

  def self.name
    'GrammarTest'
  end

  def chunks
    @chunks ||= ::GrammarChunker.chunk(parsed)
  end

  def parsed
    @parsed ||= ::GrammarParser.new.parse(text)[:questions]
  end
end
