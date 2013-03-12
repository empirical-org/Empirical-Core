class CMS::PageArea < ActiveRecord::Base
  self.table_name = 'page_areas'
  attr_accessible :content, :description, :name

  def self.name
    'PageArea'
  end
end
