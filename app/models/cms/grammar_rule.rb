class CMS::GrammarRule < ActiveRecord::Base
  self.table_name = 'grammar_rules'
  attr_accessible :description, :identifier

  def self.name
    'GrammarRule'
  end
end
