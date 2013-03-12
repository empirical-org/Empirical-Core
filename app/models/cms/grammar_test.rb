class CMS::GrammarTest < ActiveRecord::Base
  self.table_name = 'grammar_tests'
  attr_accessible :text

  def self.name
    'GrammarTest'
  end

  def chunks
    @chunks ||= parsed.inject([]) do |memo, val|
      val[:before].to_s.split(/\s+/).reject(&:blank?).each do |word|
        memo << {word: word}
      end

      memo << ::GrammarQuestion.new( val[:question].inject({}){ |m,v| m.merge(v) } )

      val[:after].to_s.split(/\s+/).reject(&:blank?).each do |word|
        memo << {word: word}
      end

      memo
    end
  end

  def parsed
    @parsed ||= ::GrammarParser.new.parse(text)[:questions]
  end
end
